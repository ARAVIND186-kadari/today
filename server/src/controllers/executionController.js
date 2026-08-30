const executionService = require('../services/executionService');

const list = async (req, res, next) => {
  try {
    const data = await executionService.listExecutions(req.user.id, req.query);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const execution = await executionService.getExecutionById(req.params.id);
    res.status(200).json({ success: true, data: execution });
  } catch (err) {
    next(err);
  }
};

const getTimeline = async (req, res, next) => {
  try {
    const timeline = await executionService.getExecutionTimeline(req.params.id);
    res.status(200).json({ success: true, data: timeline });
  } catch (err) {
    next(err);
  }
};

const pause = async (req, res, next) => {
  try {
    const execution = await executionService.pauseExecution(req.params.id, req.user.id);
    res.status(200).json({ success: true, message: 'Execution paused', data: execution });
  } catch (err) {
    next(err);
  }
};

const resume = async (req, res, next) => {
  try {
    const execution = await executionService.resumeExecution(req.params.id, req.user.id);
    res.status(200).json({ success: true, message: 'Execution resumed', data: execution });
  } catch (err) {
    next(err);
  }
};

const cancel = async (req, res, next) => {
  try {
    const execution = await executionService.cancelExecution(req.params.id, req.user.id);
    res.status(200).json({ success: true, message: 'Execution cancelled', data: execution });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  list,
  getById,
  getTimeline,
  pause,
  resume,
  cancel,
};
