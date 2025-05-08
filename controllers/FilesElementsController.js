const { Op } = require("sequelize");
const FilesElements = require("../models/FilesElements");
const fs = require("fs");

const saveElementsInBd = async (req, res) => {

    const { elements, fileId: imageId } = req.body;

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

        // verificar si los elementos ya existen en la base de datos, si existen, no los guardo de nuevo y los actualizo

        const existingElements = await FilesElements.findAll({
            where: {
                imageId: imageId,
                elementId: elementsToSave.map(element => element.elementId),
            }
        });

        const existingElementIds = existingElements
        .filter((element) => element.type !== 'Imagen')
            .map(element => element.id);

        if (existingElementIds.length > 0) {
            // eliminar los elementos existentes que no están en el nuevo array
            for (const element of existingElements) {
                await FilesElements.destroy({
                    where: {
                        id: element.id
                    }
                });
            }
        }

        const imagesToSkip = elementsToSave.filter((element) => element.type === 'Imagen')
            .map(element => element.elementId);

        // Verificar si la imagen ya existe en la base de datos
        const existingImages = await FilesElements.findAll({
            where: {
                imageId: imageId,
                elementId: imagesToSkip,
            }
        });

        // si existen no los guardo de nuevo y los actualizo
        const existingImageIds = existingImages.map(element => element.elementId);

        const finalElementsToSave = elementsToSave.filter((element) => {
            if (element.type === 'Imagen') {
                return !existingImageIds.includes(element.elementId);
            } else {
                return !existingElementIds.includes(element.id);
            }
        });

        // Guardar los elementos en la base de datos
        await FilesElements.bulkCreate(finalElementsToSave);

        return res.status(200).json({
            message: "Elementos guardados correctamente",
            elements: elementsToSave
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error al guardar los elementos", error: error.message });
    }
}

const getElementsByImageId = async (req, res) => {

    const { imageId } = req.body;

    if (!imageId) return res.status(400).json({ message: "No ha enviado el id de la imagen" });

    try {
        const elements = await FilesElements.findAll({
            where: {
                imageId: imageId
            }
        });

        return res.status(200).json({
            message: "Elementos obtenidos correctamente",
            elements: elements
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error al obtener los elementos", error: error.message });
    }

}

const deleteElementById = async (req, res) => {

    const { elementId } = req.body;

    if (!elementId) return res.status(400).json({
        ok: false,
        message: "No ha enviado el id del elemento" 
    });

    try {

        let element = await FilesElements.findOne({
            where: {
                elementId: elementId
            }
        });

        if (!element){
            element = await FilesElements.findOne({
                where: {
                    id: elementId
                }
            });
        }

        if (!element) return res.status(404).json({ message: "Elemento no encontrado" });

        // eliminar la imagen del servidor si existe
        if (element.imagePath) {
            const filePath = element.imagePath.replace(process.env.SERVER_URL + "/", "");
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // eliminar el elemento de la base de datos
        await FilesElements.destroy({
            where: {
                id: element.id
            }
        });

        return res.status(200).json({
            message: "Elemento eliminado correctamente",
            element: element
        });

    } catch (error) {
        return res.status(500).json({ message: "Error al eliminar el elemento", error: error.message });
    }

}

const updateElementById = async(req, res) => {

    const { elementId, ...data } = req.body;

    if (!elementId) return res.status(400).json({
        ok: false,
        message: "No ha enviado el id del elemento" 
    });

    try {
        let element = await FilesElements.findOne({
            where: {
                elementId: elementId
            }
        });

        if (!element){
            element = await FilesElements.findOne({
                where: {
                    id: elementId
                }
            });
        }

        if (!element) return res.status(404).json({ ok:false, message: "Elemento no encontrado" });

        // buscar elemento en la bd
        const dataToUpdate = {
            ...data.data,
            updatedAt: new Date()
        }

        // actualizar el elemento en la bd
        await FilesElements.update(dataToUpdate, {
            where: {
                id: element.id
            }
        });

        return res.status(200).json({
            message: "Elemento actualizado correctamente",
            element: element
        });

    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar el elemento", error: error.message });
    }

}

module.exports = {
    saveElementsInBd,
    getElementsByImageId,
    deleteElementById,
    updateElementById
}