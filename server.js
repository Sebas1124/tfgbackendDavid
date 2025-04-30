require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// Rutas
const filesRoutes = require('./routes/filesRoutes')
const authRoutes = require('./routes/authRoutes')

// Conexion a la base de datos
const sequelize = require('./config/database');

// modelos 
require('./models/User');
const userFiles = require('./models/UsersFiles');
const FilesElements = require('./models/FilesElements');

const { default: helmet } = require('helmet');
const { FormatNamesFiles } = require('./utils/helpers');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

const storage = multer.diskStorage({
    destination: async(req, file, cb) => {

        const token = req.header('Authorization')?.split(' ')[1];

        if (!token) throw new Error('Acceso denegado');

        const verified = jwt.verify(token, process.env.SECRET_JWT);
        req.user = verified;

        const userId = verified.id;
        const userDir = path.join(__dirname, 'uploads', userId);

        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }

        cb(null, userDir);

        // guardar la ruta en la base de datos
        const filePath = process.env.SERVER_URL + `/uploads/${userId}/${FormatNamesFiles(file.originalname)}`; // "http://localhost:4000/uploads/userId/fileName.jpg"
        const fileName = FormatNamesFiles(file.originalname); // "fileName.jpg"

        const fileData = {
            userId,
            fileName,
            filePath
        };

        await userFiles.create(fileData)
    },
    filename: (req, file, cb) => {
        const uniqueName = `${FormatNamesFiles(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

app.use(upload.any());

// Carpeta routes para las rutas
app.use('/api', filesRoutes);
app.use("/api/auth", authRoutes)

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

sequelize.sync()
    .then(() => console.log('Base de datos sincronizada'))
    .catch((err) => console.error('Error al sincronizar DB:', err));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})