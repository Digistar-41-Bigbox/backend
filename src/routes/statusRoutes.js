const express = require('express');
const statusController = require('../controllers/statusController');
const middleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/get-all', statusController.getAllStatus);

module.exports = router;