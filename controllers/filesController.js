const UserFiles = require("../models/UsersFiles");

const processFIle = (req, res) => {
   

    res.status(200).json({
        message: 'File processed successfully',
        file: req.file,
    });
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