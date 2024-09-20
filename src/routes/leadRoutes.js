const express = require('express');
const multer = require('multer');
const middleware = require('../middleware/authMiddleware');
const leadController = require('../controllers/leadController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

// router.get('/get-lead-latest', middleware.authenticateToken, leadController.getLatestLead);
// router.get('/get-total-lead-status', middleware.authenticateToken, leadController.getTotalLeadByStatus);
// router.get('/get-all-leads', middleware.authenticateToken, leadController.getAllLeads);
// router.post('/create',middleware.authenticateToken, leadController.createdLead);
// router.get('/get/:id',middleware.authenticateToken, leadController.getLeadById);
// router.put('/update/:id', middleware.authenticateToken, leadController.updateLeadById);
// router.delete('/delete/:id',middleware.authenticateToken, leadController.deleteLeadById);
// router.post('/create-file', middleware.authenticateToken, upload.single('file'), leadController.createPicByExcel);

router.get('/get-lead-latest', leadController.getLatestLead);
router.get('/get-total-lead-status', leadController.getTotalLeadByStatus);
router.get('/get-all-leads', leadController.getAllLeads);
router.post('/create', leadController.createdLead);
router.get('/get/:id', leadController.getLeadById);
router.put('/update/:id',  leadController.updateLeadById);
router.delete('/delete/:id', leadController.deleteLeadById);
router.post('/create-file',  upload.single('file'), leadController.createPicByExcel);
router.get('/export/excel', leadController.exportByExcel);

module.exports = router;