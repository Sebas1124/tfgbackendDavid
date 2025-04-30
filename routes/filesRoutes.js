const express = require('express');
const { processFIle, saveFile, getFilesByUserId } = require('../controllers/filesController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { saveElementsInBd } = require('../controllers/FilesElementsController');
const router = express.Router();

router.post('/upload', verifyToken, processFIle)
router.post("/save", saveFile)
router.post("/getFilesByUserId", verifyToken, getFilesByUserId);

router.post('/upload/elements', verifyToken, saveElementsInBd)

module.exports = router;