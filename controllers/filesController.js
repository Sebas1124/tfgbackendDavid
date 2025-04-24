const UserFiles = require("../models/UsersFiles");
const { FormatNamesFiles } = require("../utils/helpers");

const processFIle = (req, res) => {

    try{

        const file = req.files[0];

        const userId = req.user.id; // id del usuario que sube el archivo
        const filePath = process.env.SERVER_URL + `/uploads/${userId}/${FormatNamesFiles(file.originalname)}`; 
        const fileName = FormatNamesFiles(file.originalname); // "fileName.jpg"

        res.status(200).json({
            ok: true,
            message: 'Imagen subida correctamente',
            filePath,
            fileName,
        });

    }catch(error){
        console.log(error)
        res.status(500).json({
            ok: false,
            message: "Error al procesar el archivo",
            error: error.message
        })
    }
    
}

const saveFile = (req, res) => {
    console.log("Saving file...")

    res.status(200).json({
        message: 'File saved successfully',
        file: req.file,
    });
}

const getFilesByUserId = async (req, res) => {

    const { userId } = req.body;

    if (!userId) return res.status(400).json({ message: "No ha enviado el UserId" });

    try {

        const files = await UserFiles.findAll({
            where: {
                userId
            }
        });
        
        const response = {
            ok: true,
            message: "Archivos encontrados",
            files: files.map(file => {
                return {
                    id: file.id,
                    userId: file.userId,
                    fileName: file.fileName,
                    filePath: file.filePath,
                }
            })
        }

        res.status(200).json(response);
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: "Error al obtener los archivos",
            error: error.message
        })
    }

}


module.exports = {
    processFIle,
    saveFile,
    getFilesByUserId
}