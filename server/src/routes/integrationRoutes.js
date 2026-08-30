const express = require('express');
const integrationController = require('../controllers/integrationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// OAuth callback and error endpoints can be called without Bearer header from browser redirect
router.get('/oauth/:provider/callback', integrationController.oauthCallback);
router.get('/oauth/error', integrationController.oauthError);

// Protected routes
router.use(protect);

router.get('/', integrationController.list);
router.get('/status', integrationController.getStatus);
router.get('/oauth/:provider/start', integrationController.startOAuth);
router.post('/', integrationController.saveManual);
router.delete('/:provider', integrationController.disconnect);

module.exports = router;
