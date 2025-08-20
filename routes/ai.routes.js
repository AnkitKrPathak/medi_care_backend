const express = require("express");
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');
const { medicalAssistance, getChatHistory } = require("../controllers/ai.controller");

router.post("/medical-assistant", verifyToken("patient"), medicalAssistance);
router.get("/chat-history/:patientId", verifyToken("patient"), getChatHistory);

module.exports = router;
