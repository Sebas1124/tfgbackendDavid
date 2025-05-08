const express = require('express');
const { processFIle, saveFile, getFilesByUserId } = require('../controllers/filesController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { saveElementsInBd, getElementsByImageId, deleteElementById, updateElementById } = require('../controllers/FilesElementsController');
const router = express.Router();

router.post('/upload', verifyToken, processFIle)
router.post("/save", saveFile)
router.post("/getFilesByUserId", verifyToken, getFilesByUserId);

router.post('/upload/elements', verifyToken, saveElementsInBd);
router.post('/get/elements', verifyToken, getElementsByImageId);
router.delete('/delete/element', verifyToken, deleteElementById);
router.put('/update/element', verifyToken, updateElementById);

module.exports = router;