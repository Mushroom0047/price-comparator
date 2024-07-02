const puppeteer = require('puppeteer');
const { createLogMessage } = require('../utils/createLog');

async function createBrowser(){
    try{
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: puppeteer.executablePath(), // Asegura que Puppeteer use la ruta correcta de Chrome
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage', // Reduce el uso de /dev/shm
              '--single-process', // Ejecuta todo en un solo proceso
              '--disable-accelerated-2d-canvas',
              '--disable-gpu',
              '--disable-notifications', // Deshabilita las notificaciones
              '--disable-crash-reporter', // Deshabilita el reporte de crashes
              '--disable-sync', // Deshabilita la sincronización
              '--disable-background-networking', // Deshabilita las conexiones de red en segundo plano
              '--disable-background-timer-throttling', // Deshabilita la reducción de temporizadores en segundo plano
              '--disable-backgrounding-occluded-windows', // Deshabilita el procesamiento en segundo plano de ventanas ocultas
              '--disable-renderer-backgrounding' // Deshabilita el procesamiento en segundo plano del renderizador
            ]
          });

          return browser;

    }catch(err){
        createLogMessage(`Error al crear el navegador: ${err}`);
        return null;
    }
}

module.exports = {createBrowser}