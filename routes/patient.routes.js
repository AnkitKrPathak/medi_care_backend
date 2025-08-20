const express = require('express');
const router = express.Router();
const { registerPatient, loginPatient, getLoggedInPatient } = require('../controllers/patient.controller');
const { getMulterUploader } = require('../middlewares/upload.middleware');
const verifyToken = require('../middlewares/auth.middleware');

const patientUpload = getMulterUploader('patient_photos');

// POST /api/patients/register
router.post('/register', patientUpload.single('profilePhoto'), registerPatient);

router.post('/login', loginPatient);

// Protected route
router.get('/me', verifyToken(['patient']), getLoggedInPatient);

module.exports = router;
