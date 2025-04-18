require('dotenv').config();

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Acceso denegado' });

    try {
        
        const verified = jwt.verify(token, process.env.SECRET_JWT);
        req.user = verified;

        next();

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Token no válido' });
    }
}

module.exports = {
    verifyToken
}