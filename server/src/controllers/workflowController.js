const { validationResult } = require('express-validator');
const workflowService = require('../services/workflowService');
const aiService = require('../services/aiService');
const executionService = require('../services/executionService');

const getDashboard = async (req, res, next) => {
  try {
    const data = await workflowService.getDashboardMetrics(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const data = await workflowService.listWorkflows(req.user.id, req.query);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const workflow = await workflowService.createWorkflow(req.user.id, req.body);
    res.status(201).json({ success: true, message: 'Workflow created successfully', data: workflow });
  } catch (err) {
    next(err);
  }
};

const generate = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required for workflow generation' });
    }

    const generatedGraph = await aiService.generateWorkflowFromPrompt(prompt);
    res.status(200).json({
      success: true,
      message: 'Workflow generated successfully from prompt',
      data: generatedGraph,
    });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const workflow = await workflowService.getWorkflowById(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: workflow });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const workflow = await workflowService.updateWorkflow(req.params.id, req.user.id, req.body);
    res.status(200).json({ success: true, message: 'Workflow updated', data: workflow });
  } catch (err) {
    next(err);
  }
};

const duplicate = async (req, res, next) => {
  try {
    const clone = await workflowService.duplicateWorkflow(req.params.id, req.user.id);
    res.status(201).json({ success: true, message: 'Workflow duplicated', data: clone });
  } catch (err) {
    next(err);
  }
};

const execute = async (req, res, next) => {
  try {
    const execution = await executionService.createAndStartExecution(
      req.params.id,
      req.user.id,
      req.body.inputs || {}
    );
    res.status(200).json({
      success: true,
      message: 'Workflow execution initiated successfully',
      data: execution,
    });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await workflowService.deleteWorkflow(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboard,
  list,
  create,
  generate,
  getById,
  update,
  duplicate,
  execute,
  remove,
};
