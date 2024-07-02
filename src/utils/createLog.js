const path = require('path');
const fs = require('fs');

const logFilePath = path.resolve(__dirname, '..', 'Logs', 'log.txt');
console.log(logFilePath);

function createLogMessage(message) {
    const timestamp = new Date().toISOString();
    const log = `${timestamp} - ${message}\n`;
    console.log(log);
    fs.appendFileSync(logFilePath, log, 'utf-8');
  }

module.exports = { createLogMessage };