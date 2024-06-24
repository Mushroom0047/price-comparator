const cron = require('node-cron');
const { updateProductList } = require('./src/services/updateProductList');
const { getProductPrice } = require('./src/services/getProductPrice');
const { createLogMessage } = require('./src/utils/createLog');
const { listadoUrls } = require('./src/assets/ListadoUrlProductos');

async function main(){
  try {
    createLogMessage('Inicio de script');
    for (const url of listadoUrls) {
      createLogMessage(`Procesando URL: ${url}`);
      const productData = await getProductPrice(url);
      if (productData) {
        await updateProductList(productData);
        createLogMessage(`Datos del producto actualizados para URL: ${url}`);
      } else {
        createLogMessage(`No se encontraron datos para URL: ${url}`);
      }
    }
    createLogMessage("El Script termino de ejecutarse \n-------------------------------------------");
  } catch (error) {
    createLogMessage(`Error en main: ${error.message}`);
  }
}

// Programar la tarea para ejecutarse cada 5 minutos
cron.schedule('*/5 * * * *', async () => {
  await main();
});

// Ejecutar la función inmediatamente al iniciar
(async () => {
  await main();
})();