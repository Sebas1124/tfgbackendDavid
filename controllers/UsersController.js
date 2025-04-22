const bycrypt = require('bcryptjs');
const User = require('../models/User');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const register = async(req, res) => {

    try {

        const { name, email, password } = req.body

        const userExist = await User.findOne({
            where: {
                email
            }
        });

        if (userExist) return res.status(400).json({ message: "El usuario ya existe" });

        const passwordHas = await bycrypt.hash(password, 10);

        if(!name || !email || !password) {
            return res.status(400).json({
                message: `Todos los campos son requeridos ${name} ${email} ${password}`
            })
        }

        const user = await User.create({
            name,
            email,
            password: passwordHas
        });

        const token = jwt.sign(
            { id: user.id },
            process.env.SECRET_JWT,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            ok: true,
            message: "Usuario creado correctamente",
            token
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: "Error al crear el usuario",
            error: error.message
        })
    }

}

const login = async(req, res) => {
    try {
        
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: `Todos los campos son requeridos ${email} ${password}` });

        const user = await User.findOne({
            where: {
                email
            }
        });

        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        const passwordMatch = await bycrypt.compare(password, user.password);

        if(!passwordMatch) return res.status(401).json({ message: "Email o Contraseña incorrecta" });

        const token = jwt.sign(
            { id: user.id },
            process.env.SECRET_JWT,
            { expiresIn: '24h' }
        );

        const userData = {
            name: user.name,
            email: user.email,
            id: user.id,
        }

        res.status(200).json({
            ok: true,
            message: "Usuario logueado correctamente",
            token,
            user: userData
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: "Error al loguear el usuario",
            error: error.message
        })
    }
}

const verifyTokenController = async(req, res) => {

    try {
        
        const { token } = req.body;
        
        if (!token) return res.status(401).json({ message: "Token no proporcionado" });

        const decoded = jwt.verify(token, process.env.SECRET_JWT);

        const user = await User.findOne({
            where: {
                id: decoded.id
            }
        });

        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        const newToken = jwt.sign(
            { id: user.id },
            process.env.SECRET_JWT,
            { expiresIn: '24h' }
        );

        const userData = {
            name: user.name,
            email: user.email,
            id: user.id,
        }

        res.status(200).json({
            ok: true,
            message: "Token verificado correctamente",
            token: newToken,
            user: userData
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: "Error al verificar el token",
            error: error.message
        })
    }

}


module.exports = {
    register,
    login,
    verifyTokenController
}