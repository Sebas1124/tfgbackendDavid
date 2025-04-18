const express = require('express');
const { register, login, verifyTokenController } = require('../controllers/UsersController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', register)
router.post("/login", login)
router.post("/verifyToken", verifyToken, verifyTokenController)

module.exports = router;