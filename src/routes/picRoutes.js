const express = require('express');
const picController = require('../controllers/picController');
const middleware = require('../middleware/authMiddleware');

const router = express.Router();

// router.get('/get-all', middleware.authenticateToken, middleware.authorizeRole(['admin']), picController.getAllPic);
// router.get('/get/:id', middleware.authenticateToken, middleware.authorizeRole(['admin']), picController.getPicById);
// router.put('/edit/:id', middleware.authenticateToken, middleware.authorizeRole(['admin']), picController.updatePicById);
// router.delete('/delete/:id', middleware.authenticateToken, middleware.authorizeRole(['admin']), picController.deletePicById);

router.get('/get-all', picController.getAllPic);
router.get('/get-all-filter', picController.getAllPicForFilter);
router.get('/get/:id', picController.getPicById);
router.put('/edit/:id', picController.updatePicById);
router.delete('/delete/:id', picController.deletePicById);

module.exports = router;