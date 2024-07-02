const { generateCurrentDate } = require('../utils/generateCurrentDate'); 
const { cleanAndParseValue } = require('../utils/cleanAndParseValue'); 
const { createLogMessage } = require('../utils/createLog');
const puppeteer = require('puppeteer');

async function getProductPrice(url) {
    createLogMessage(`Inicio de la funcion getProductPrice para: ${url}`);
    let id = 0;
    let currentDate = generateCurrentDate();
    let parcedPrice = null;
    let product = null;
  
    try {
      const browser = await puppeteer.launch({
        headless: true,
        executablePath: puppeteer.executablePath(), // Asegura que Puppeteer use la ruta correcta de Chrome
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      });
      const page = await browser.newPage();
  
      await page.goto(url);
      await page.waitForSelector('#DetalleProducto');
      const elementPrice = await page.$('.Detalle');
      const elementTitle = await page.$('#DetalleProducto h1');
  
      //Obtener titulo del producto
      const title = await elementTitle.evaluate(el => el.textContent.trim());
  
      const productPrice = await elementPrice.evaluate(() => {
        const elements = document.querySelectorAll('.DetVal');
  
        for (const element of elements) {
          // Comprueba si el texto del elemento contiene el signo $
          if (element.textContent.includes('$')) {
            return element.textContent.trim();
          }
        }
        return null; // Retorna null si no encuentra ningún elemento con $
      });
  
      if (productPrice) {
        parcedPrice = cleanAndParseValue(productPrice);
        id = url.split('=')[1];
  
        //Generar json para almacenar
        product = {
          id: id,
          title: title,
          currentPrice: parcedPrice,
          url: url,
          date: currentDate,
        }
      } else {
        product = null;
        createLogMessage(`No se pudo obtener el precio del producto: productPrice: ${product}`);
      }
  
      await browser.close();
  
      return product;
  
    } catch (error) {
      createLogMessage(`Error al conectarse a la web: ${error}`);
    }
  
    createLogMessage('Fin de la funcion getProductPrice');
  }

  module.exports = { getProductPrice };