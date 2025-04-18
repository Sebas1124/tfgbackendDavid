const express = require('express');
const { processFIle, saveFile } = require('../controllers/filesController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/upload', verifyToken, processFIle)
router.post("/save", saveFile)

module.exports = router;