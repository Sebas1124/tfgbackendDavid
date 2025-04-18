const express           = require('express');
const cors              = require('cors');
const multer            = require('multer');
const { v4: uuidv4 }    = require('uuid');
const fs                = require('fs');
const path              = require('path');
const bodyParser        = require('body-parser');

// Rutas
const filesRoutes = require('./routes/filesRoutes')
const authRoutes = require('./routes/authRoutes')

// Conexion a la base de datos
const sequelize = require('./config/database');

// modelos 
const User = require('./models/User');
const { default: helmet } = require('helmet');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${path.extname(file.originalname)}`
        cb(null, uniqueName);
    }
})

const upload = multer({ storage });

app.use(upload.any());

// Carpeta routes para las rutas
app.use('/api', filesRoutes);
app.use("/api/auth", authRoutes)

app.use("/uploads", express.static("/uploads"));

const PORT = process.env.PORT || 5000;

sequelize.sync()
    .then(() => console.log('Base de datos sincronizada'))
    .catch((err) => console.error('Error al sincronizar DB:', err));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})