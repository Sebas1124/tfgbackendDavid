const FilesElements = require("../models/FilesElements");
const fs = require("fs");

const saveElementsInBd = async (req, res) => {

    const { elements, fileId: imageId } = req.body;
    console.log("Elements: ", elements)
    console.log("FileId: ", imageId)

    if (!elements || !imageId)
        return res.status(400).json({ message: "No ha enviado los elementos" });

    const elementsToSave = elements.map(element => {

        let filePath = null; // Inicializa filePath como null

        if (element.type === 'Imagen') {
            // la imagen se está subiendo en base64, por lo que necesito convertirla a un archivo y guardarla y almacenar la ruta en la base de datos

            const base64Data = element.image.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, 'base64');
            const fileName = `${element.id}-${Date.now()}.png`;
            filePath = `uploads/${imageId}/${fileName}`; // Cambia la ruta según tu estructura de carpetas

            const dir = `uploads/${imageId}`; // Cambia la ruta según tu estructura de carpetas
            if (!fs.existsSync(dir))
                fs.mkdirSync(dir, { recursive: true });
            
            fs.writeFileSync(filePath, buffer, (err) => {
                if (err) {
                    console.error("Error al guardar la imagen:", err);
                } else {
                    console.log("Imagen guardada correctamente:", filePath);
                }
            });

            filePath = process.env.SERVER_URL + "/" + filePath; // Cambia la ruta según tu estructura de carpetas

        }

        return {
            elementId: element.id,
            imageId: imageId,
            type: element.type,
            position_x: element.x,
            position_y: element.y,
            scaleX: element.scaleX,
            scaleY: element.scaleY,
            rotation: element.rotation,
            fontSize: element.fontSize,
            fill: element.fill,
            stroke: element.stroke,
            strokeWidth: element.strokeWidth,
            imagePath: filePath,
            width: element.width,
            height: element.height,
            fontFamily: element.fontFamily,
            text: element.text,
            textAlign: element.textAlign,
            fontWeight: element.fontWeight,
            data: element.data,
        }
    });

    // Guardar los elementos en la base de datos
    try {
        await FilesElements.bulkCreate(elementsToSave);

        return res.status(200).json({
            message: "Elementos guardados correctamente",
            elements: elementsToSave
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error al guardar los elementos", error: error.message });
    }
}

module.exports = {
    saveElementsInBd
}