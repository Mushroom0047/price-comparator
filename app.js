const cron = require('node-cron');
const { updateProductList } = require('./src/services/updateProductList');
const { getProductPrice } = require('./src/services/getProductPrice');
const { createLogMessage } = require('./src/utils/createLog');
const { listadoUrls } = require('./src/assets/ListadoUrlProductos');

async function main() {
  try {
    createLogMessage('Inicio de script');
    
    // Uso de Promise.all para concurrencia controlada
    const promises = listadoUrls.map(async (url) => {
      createLogMessage(`Procesando URL: ${url}`);
      try {
        const productData = await getProductPrice(url);
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

    createLogMessage("El Script termino de ejecutarse \n-------------------------------------------");
  } catch (error) {
    createLogMessage(`Error en main: ${error.message}`);
  }
}

// Programar la tarea para ejecutarse cada 30 minutos
cron.schedule('*/30 * * * *', async () => {
  await main();
});

// Ejecutar la función inmediatamente al iniciar
(async () => {
  await main();
})();