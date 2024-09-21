const express = require('express');
const { register, login, refreshToken, logout, getCurrentUser } = require('../controllers/userContoller');
const middleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/token', refreshToken);
router.delete('/logout', logout);
router.get('/get-user', middleware.authenticateToken, getCurrentUser);

module.exports = router;
