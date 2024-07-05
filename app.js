const { updateProductList } = require('./src/services/updateProductList');
const { getProductPrice } = require('./src/services/getProductPrice');
const { createLogMessage } = require('./src/utils/createLog');
const { listadoUrls } = require('./src/assets/ListadoUrlProductos');
const puppeteer = require('puppeteer');

async function main() {
  let browser;

  try {
    createLogMessage('Inicio de script');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    if (!browser) {
      console.log('Error: El objeto browser es null');
      return; // Termina la ejecución de la función main
    }
    
    // Map para crear un array de promesas
    const promises = listadoUrls.map(async (url) => {
      let attempt = 0;
      const maxAttempts = 3;
      let success = false;

      while (attempt < maxAttempts && !success) {
        attempt++;
        try {
          const page = await browser.newPage();
          await page.setDefaultNavigationTimeout(90000); // Establece el tiempo de espera de navegación a 90 segundos

          // Desactivar la carga de imágenes y otros recursos no esenciales
          await page.setRequestInterception(true);
          page.on('request', (req) => {
            if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
              req.abort();
            } else {
              req.continue();
            }
          });

          await page.goto(url, { waitUntil: 'networkidle2' }); // Aumenta el tiempo de espera y espera hasta que la red esté ociosa

          const productData = await getProductPrice(page);
          if (productData) {
            await updateProductList(productData);
            success = true; // Marca el intento como exitoso
          } else {
            createLogMessage(`No se encontraron datos para URL: ${url}`);
          }
          await page.close(); // Cerrar la página después de procesar
        } catch (error) {
          createLogMessage(`Error procesando URL: ${url} - Intento ${attempt} - ${error.message}`);
          if (attempt >= maxAttempts) {
            createLogMessage(`Maximos intentos alcanzados para URL: ${url}`);
          }
        }
      }
    });

    // Espera a que todas las promesas se resuelvan
    await Promise.all(promises);
    await browser.close();
    createLogMessage("El Script terminó de ejecutarse \n-------------------------------------------");

  } catch (error) {
    createLogMessage(`Error en main: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Ejecutar la función inmediatamente al iniciar
(async () => {
  await main();
})();
