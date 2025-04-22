

const FormatNamesFiles = (nameFile) => {

    // quitar los espacios en blanco al principio y al final del nombre del archivo
    nameFile = nameFile.trim();

    // quitar los espacios en blanco entre las palabras del nombre del archivo
    nameFile = nameFile.replace(/\s+/g, '_');

    // quitar los caracteres especiales del nombre del archivo
    nameFile = nameFile.replace(/[^a-zA-Z0-9_.-]/g, '');

    // convertir el nombre del archivo a minusculas
    nameFile = nameFile.toLowerCase();

    return nameFile;
}

module.exports = {
    FormatNamesFiles
}