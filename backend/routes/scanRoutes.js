const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/scan', authMiddleware, scanController.scanUrl);
router.get('/history', authMiddleware, scanController.getHistory);
router.get('/analytics', authMiddleware, scanController.getAnalytics);

module.exports = router;
