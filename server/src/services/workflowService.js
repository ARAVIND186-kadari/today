const Workflow = require('../models/Workflow');
const Execution = require('../models/Execution');

const listWorkflows = async (userId, query = {}) => {
  const { search, status, tag, page = 1, limit = 20 } = query;
  const filter = { owner: userId };

  if (status && status !== 'all') {
    filter.status = status;
  }

  if (tag) {
    filter.tags = tag;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const [workflows, total] = await Promise.all([
    Workflow.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean(),
    Workflow.countDocuments(filter),
  ]);

  return {
    workflows,
    total,
    page: parseInt(page, 10),
    totalPages: Math.ceil(total / parseInt(limit, 10)),
  };
};

const getWorkflowById = async (workflowId, userId) => {
  const workflow = await Workflow.findOne({ _id: workflowId, owner: userId });
  if (!workflow) {
    const error = new Error('Workflow not found');
    error.statusCode = 404;
    throw error;
  }
  return workflow;
};

const createWorkflow = async (userId, data) => {
  const workflow = new Workflow({
    name: data.name || 'Untitled Workflow',
    description: data.description || '',
    owner: userId,
    status: data.status || 'draft',
    triggerConfig: data.triggerConfig || { type: 'manual' },
    nodes: data.nodes || [],
    edges: data.edges || [],
    version: 1,
    tags: data.tags || [],
  });

  await workflow.save();
  return workflow;
};

const updateWorkflow = async (workflowId, userId, data) => {
  const workflow = await Workflow.findOne({ _id: workflowId, owner: userId });
  if (!workflow) {
    const error = new Error('Workflow not found');
    error.statusCode = 404;
    throw error;
  }

  if (data.name !== undefined) workflow.name = data.name;
  if (data.description !== undefined) workflow.description = data.description;
  if (data.status !== undefined) workflow.status = data.status;
  if (data.triggerConfig !== undefined) workflow.triggerConfig = data.triggerConfig;
  if (data.nodes !== undefined) workflow.nodes = data.nodes;
  if (data.edges !== undefined) workflow.edges = data.edges;
  if (data.tags !== undefined) workflow.tags = data.tags;

  workflow.version = (workflow.version || 1) + 1;
  await workflow.save();
  return workflow;
};

const duplicateWorkflow = async (workflowId, userId) => {
  const source = await getWorkflowById(workflowId, userId);
  const clone = new Workflow({
    name: `${source.name} (Copy)`,
    description: source.description,
    owner: userId,
    status: 'draft',
    triggerConfig: source.triggerConfig,
    nodes: source.nodes,
    edges: source.edges,
    tags: source.tags,
    version: 1,
  });

  await clone.save();
  return clone;
};

const deleteWorkflow = async (workflowId, userId) => {
  const workflow = await Workflow.findOneAndDelete({ _id: workflowId, owner: userId });
  if (!workflow) {
    const error = new Error('Workflow not found');
    error.statusCode = 404;
    throw error;
  }
  return { success: true, message: 'Workflow deleted successfully' };
};

const getDashboardMetrics = async (userId) => {
  const [totalWorkflows, activeWorkflows, executions, recentExecutions] = await Promise.all([
    Workflow.countDocuments({ owner: userId }),
    Workflow.countDocuments({ owner: userId, status: 'active' }),
    Execution.find({ createdBy: userId }).select('status duration startTime endTime').lean(),
    Execution.find({ createdBy: userId })
      .populate('workflowId', 'name tags')
      .sort({ startTime: -1 })
      .limit(6)
      .lean(),
  ]);

  const totalExecutions = executions.length;
  const completedExecutions = executions.filter((e) => e.status === 'COMPLETED').length;
  const failedExecutions = executions.filter((e) => e.status === 'FAILED').length;
  const successRate = totalExecutions > 0 ? ((completedExecutions / totalExecutions) * 100).toFixed(1) : '100.0';

  const totalDuration = executions.reduce((acc, e) => acc + (e.duration || 0), 0);
  const avgDurationMs = totalExecutions > 0 ? Math.round(totalDuration / totalExecutions) : 0;

  return {
    totalWorkflows,
    activeWorkflows,
    totalExecutions,
    completedExecutions,
    failedExecutions,
    successRate: parseFloat(successRate),
    avgDurationMs,
    recentExecutions,
  };
};

module.exports = {
  listWorkflows,
  getWorkflowById,
  createWorkflow,
  updateWorkflow,
  duplicateWorkflow,
  deleteWorkflow,
  getDashboardMetrics,
};
