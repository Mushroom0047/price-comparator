const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { listadoUrls } = require('./src/assets/ListadoUrlProductos');
const { generateCurrentDate } = require('./src/utils/generateCurrentDate'); 
const { cleanAndParseValue } = require('./src/utils/cleanAndParseValue'); 
const { sendEmailToUser } = require('./src/services/sendEmail');
const { createLogMessage } = require('./src/utils/createLog');

const jsonFilePath = path.resolve(__dirname, 'src', 'assets', 'productList.json');

async function getProductPrice(url) {
  createLogMessage('Inicio de la funcion getProductPrice');
  let id = 0;
  let currentDate = generateCurrentDate();
  let parcedPrice = null;
  let product = null;

  try {
    const browser = await puppeteer.launch();
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
      createLogMessage('No se pudo obtener el precio del producto: productPrice = null');
    }

    await browser.close();

    return product;

  } catch (error) {
    createLogMessage(`Error al conectarse a la web: ${error}`);
  }

  createLogMessage('Fin de la funcion getProductPrice');
}

// Función para comprobar y actualizar el archivo JSON
async function updateProductList(product) {
  try {
    createLogMessage('Inicia función updateProductList');
    // Leer el archivo JSON
    let products = [];
    if (fs.existsSync(jsonFilePath)) {
      const data = fs.readFileSync(jsonFilePath, 'utf-8');
      if (data.trim().length > 0) {
        products = JSON.parse(data);
      }
    }else{
      createLogMessage('Error: no existe el archivo en el directoriio')
    }

    // Verificar si el producto ya existe
    let productInJson = products.find(p => p.id === product.id);

    if (productInJson) {
      if (productInJson.currentPrice != product.currentPrice) {
        // Encontrar el índice del producto existente con el mismo id
        let index = products.findIndex(p => p.id === product.id);
        
        if (index !== -1) {
          // Reemplazar el producto existente
          products[index] = product;
        } else {
          // Agregar el nuevo producto a la lista
          products.push(product);
        }
        
        // Escribir los datos actualizados de vuelta en el archivo JSON
        fs.writeFileSync(jsonFilePath, JSON.stringify(products, null, 2), 'utf-8');
        createLogMessage(`El valor del producto ${productInJson.title} se modifico correctamente`);

        //Enviar email con notificación
        sendEmailToUser(product, productInJson);       
      }
    } else {
      // Agregar el nuevo producto al array
      products.push(product);

      // Escribir los datos actualizados de vuelta en el archivo JSON
      fs.writeFileSync(jsonFilePath, JSON.stringify(products, null, 2), 'utf-8');
      createLogMessage(`El producto se agrego al listado correctamente: id de producto = ${product.id}`);
    }

  } catch (error) {
    createLogMessage(`Algo anda mal con la función updateProductList: ${error}`);
  }
  createLogMessage('Fin de la funcion updateProductList');
}

(async () => {
  createLogMessage('Inicio de script');
  for (const url of listadoUrls) {
    const productData = await getProductPrice(url);
    if (productData) {
      await updateProductList(productData);
    }
  }
  createLogMessage("El Script termino de ejecutarse \n-------------------------------------------");
})();