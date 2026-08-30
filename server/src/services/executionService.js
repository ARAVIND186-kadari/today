const Execution = require('../models/Execution');
const ExecutionLog = require('../models/ExecutionLog');
const Workflow = require('../models/Workflow');
const { addExecutionJob } = require('../queues/executionQueue');
const { emitExecutionEvent } = require('../config/socket');

const createAndStartExecution = async (workflowId, userId, inputs = {}) => {
  const workflow = await Workflow.findById(workflowId);
  if (!workflow) {
    const error = new Error('Workflow not found');
    error.statusCode = 404;
    throw error;
  }

  // Create immutable snapshot of workflow at runtime
  const workflowSnapshot = {
    _id: workflow._id,
    name: workflow.name,
    description: workflow.description,
    triggerConfig: workflow.triggerConfig,
    nodes: workflow.nodes,
    edges: workflow.edges,
    version: workflow.version,
    tags: workflow.tags,
  };

  const execution = new Execution({
    workflowId: workflow._id,
    workflowSnapshot,
    status: 'PENDING',
    inputs: inputs || {},
    createdBy: userId,
    startTime: new Date(),
  });

  await execution.save();

  // Enqueue execution via BullMQ / In-memory queue
  await addExecutionJob({ executionId: execution._id.toString() });

  return execution;
};

const listExecutions = async (userId, query = {}) => {
  const { status, workflowId, page = 1, limit = 20 } = query;
  const filter = { createdBy: userId };

  if (status && status !== 'all') {
    filter.status = status;
  }

  if (workflowId) {
    filter.workflowId = workflowId;
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const [executions, total] = await Promise.all([
    Execution.find(filter)
      .populate('workflowId', 'name tags')
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean(),
    Execution.countDocuments(filter),
  ]);

  return {
    executions,
    total,
    page: parseInt(page, 10),
    totalPages: Math.ceil(total / parseInt(limit, 10)),
  };
};

const getExecutionById = async (executionId) => {
  const execution = await Execution.findById(executionId)
    .populate('workflowId', 'name description tags')
    .populate('createdBy', 'name email');

  if (!execution) {
    const error = new Error('Execution run not found');
    error.statusCode = 404;
    throw error;
  }
  return execution;
};

const getExecutionTimeline = async (executionId) => {
  const logs = await ExecutionLog.find({ executionId })
    .sort({ timestamp: 1 })
    .lean();
  return logs;
};

const pauseExecution = async (executionId, userId) => {
  const execution = await Execution.findOne({ _id: executionId, createdBy: userId });
  if (!execution) {
    const error = new Error('Execution not found');
    error.statusCode = 404;
    throw error;
  }

  if (execution.status !== 'RUNNING' && execution.status !== 'RETRYING') {
    const error = new Error(`Cannot pause execution in status ${execution.status}`);
    error.statusCode = 400;
    throw error;
  }

  execution.status = 'PAUSED';
  await execution.save();

  emitExecutionEvent(executionId.toString(), 'execution_paused', { status: 'PAUSED' });
  return execution;
};

const resumeExecution = async (executionId, userId) => {
  const execution = await Execution.findOne({ _id: executionId, createdBy: userId });
  if (!execution) {
    const error = new Error('Execution not found');
    error.statusCode = 404;
    throw error;
  }

  if (execution.status !== 'PAUSED') {
    const error = new Error(`Cannot resume execution in status ${execution.status}`);
    error.statusCode = 400;
    throw error;
  }

  execution.status = 'PENDING';
  await execution.save();

  await addExecutionJob({ executionId: execution._id.toString() });
  emitExecutionEvent(executionId.toString(), 'execution_resumed', { status: 'PENDING' });
  return execution;
};

const cancelExecution = async (executionId, userId) => {
  const execution = await Execution.findOne({ _id: executionId, createdBy: userId });
  if (!execution) {
    const error = new Error('Execution not found');
    error.statusCode = 404;
    throw error;
  }

  if (execution.status === 'COMPLETED' || execution.status === 'FAILED') {
    const error = new Error(`Cannot cancel an execution that is already ${execution.status}`);
    error.statusCode = 400;
    throw error;
  }

  execution.status = 'CANCELLED';
  execution.endTime = new Date();
  execution.duration = Date.now() - new Date(execution.startTime).getTime();
  await execution.save();

  emitExecutionEvent(executionId.toString(), 'execution_cancelled', { status: 'CANCELLED' });
  return execution;
};

module.exports = {
  createAndStartExecution,
  listExecutions,
  getExecutionById,
  getExecutionTimeline,
  pauseExecution,
  resumeExecution,
  cancelExecution,
};
