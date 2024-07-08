const puppeteer = require('puppeteer');
const { createLogMessage } = require('../utils/createLog');

async function createBrowser(){
    try{
        const browser = await puppeteer.launch({
            headless: true,
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
            ]
          });

          return browser;

    }catch(err){
        createLogMessage(`Error al crear el navegador: ${err}`);
        return null;
    }
}

module.exports = {createBrowser}