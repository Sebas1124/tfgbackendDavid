const express = require('express');
const { processFIle, saveFile, getFilesByUserId } = require('../controllers/filesController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/upload', verifyToken, processFIle)
router.post("/save", saveFile)
router.post("/getFilesByUserId", verifyToken, getFilesByUserId);

module.exports = router;