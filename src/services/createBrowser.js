const puppeteer = require('puppeteer');
const { createLogMessage } = require('../utils/createLog');

async function createBrowser(){
    try{
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: '/usr/bin/chromium-browser',
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-gpu',
            ]
          });

          return browser;

    }catch(err){
        createLogMessage(`Error al crear el navegador: ${err}`);
        return null;
    }
}

module.exports = {createBrowser}