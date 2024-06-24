const path = require('path');
const fs = require('fs');

const logFilePath = path.resolve(__dirname, 'log.txt');

function createLogMessage(message) {
    const timestamp = new Date().toISOString();
    const log = `${timestamp} - ${message}\n`;
    fs.appendFileSync(logFilePath, log, 'utf-8');
  }

module.exports = { createLogMessage };