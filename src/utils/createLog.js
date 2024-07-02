const path = require('path');
const fs = require('fs');

const logsDirPath = path.resolve(__dirname, '..', 'Logs');
const logFilePath = path.resolve(logsDirPath, 'log.txt');

function createLogMessage(message) {
    const timestamp = new Date().toISOString();
    const log = `${timestamp} - ${message}\n`;
    
    // Verificar si la carpeta Logs existe, si no, crearla
    if (!fs.existsSync(logsDirPath)) {
        fs.mkdirSync(logsDirPath, { recursive: true });
    }

    // Escribir el mensaje en el archivo log.txt
    fs.appendFileSync(logFilePath, log, 'utf-8');
  
    console.log(log); // Opcional: imprimir el mensaje en la consola
}

module.exports = { createLogMessage };