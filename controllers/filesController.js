
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


module.exports = {
    processFIle,
    saveFile,
}