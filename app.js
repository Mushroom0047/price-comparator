const { updateProductList } = require('./src/services/updateProductList');
const { getProductPrice } = require('./src/services/getProductPrice');
const { createLogMessage } = require('./src/utils/createLog');
const { listadoUrls } = require('./src/assets/ListadoUrlProductos');
// const { createBrowser } = require('./src/services/createBrowser');

const puppeteer = require('puppeteer');
// const { createLogMessage } = require('../utils/createLog');

// async function createBrowser(){
//     try{
//         const browser = await puppeteer.launch({
//             headless: true,
//             // executablePath: '/usr/bin/chromium-browser',
//             args: [
//               '--no-sandbox',
//               '--disable-setuid-sandbox',
//             ]
//           });

//           return browser;

//     }catch(err){
//         createLogMessage(`Error al crear el navegador: ${err}`);
//         return null;
//     }
// }

async function main() {
  // let browser;
  
  try {
    createLogMessage('Inicio de script');
    // browser = await createBrowser();
    const browser = await puppeteer.launch({
                  headless: true,
                  // executablePath: '/usr/bin/chromium-browser',
                  args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                  ]
                });

    if (!browser) {
      console.log('Error: El objeto browser es null');
      return; // Termina la ejecución de la función main
    }
    
      // Map para crear un array de promesas
      const promises = listadoUrls.map(async (url) => {
        
        try {
          const productData = await getProductPrice(url, browser);
          if (productData) {
            await updateProductList(productData);
          } else {
            createLogMessage(`No se encontraron datos para URL: ${url}`);
          }
        } catch (error) {
          createLogMessage(`Error procesando URL: ${url} - ${error.message}`);
        }
      });
  
      // Espera a que todas las promesas se resuelvan
      await Promise.all(promises);
      await browser.close();
      createLogMessage("El Script terminó de ejecutarse \n-------------------------------------------");

  } catch (error) {
    createLogMessage(`Error en main: ${error.message}`);
  }finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Ejecutar la función inmediatamente al iniciar
(async () => {
  await main();
})();