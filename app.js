const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { listadoUrls } = require('./src/assets/ListadoUrlProductos');
const generateCurrentDate = require('./src/utils/generateCurrentDate');
const clpConverter = require('./src/utils/clpConverter'); 
const cleanAndParseValue = require('./src/utils/cleanAndParseValue'); 
const sendEmail = require('./src/services/sendEmail');

const jsonFilePath = path.resolve(__dirname, 'productList.json');
let htmlContent = '';

async function getProductPrice(url) {
  let id = 0;
  let currentDate = generateCurrentDate();
  let parcedPrice = 0;

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
    } else {
      console.log('Error: no existe el valor');
    }

    //Generar json para almacenar
    let product = {
      id: id,
      title: title,
      currentPrice: parcedPrice,
      url: url,
      date: currentDate,
    }

    await browser.close();

    return product;

  } catch (error) {
    console.error('Error fetching the product price:', error);
  }
}

// Función para comprobar y actualizar el archivo JSON
async function updateProductList(product) {
  try {
    // Leer el archivo JSON
    let products = [];
    if (fs.existsSync(jsonFilePath)) {
      const data = fs.readFileSync(jsonFilePath, 'utf-8');
      if (data.trim().length > 0) {
        products = JSON.parse(data);
      }
    }

    // Verificar si el producto ya existe
    let productInJson = products.find(p => p.id === product.id);

    if (productInJson) {
      if (productInJson.currentPrice != product.currentPrice) {
        console.log(`El valor del producto ${productInJson.title} cambio !`);

        sendingEmail(product, productInJson);
        
        console.log(`Actualizando el valor del json del producto ${productInJson.title}`);        

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
      }
    } else {
      // Agregar el nuevo producto al array
      products.push(product);

      // Escribir los datos actualizados de vuelta en el archivo JSON
      fs.writeFileSync(jsonFilePath, JSON.stringify(products, null, 2), 'utf-8');
      console.log(`Archivo productList.json actualizado con nuevo producto ${product.id}`);
    }

  } catch (error) {
    console.error('Error updating product list:', error);
  }
}

function sendingEmail(productNewData, productDataJson){
  let valueNewData = clpConverter(productNewData.currentPrice);
  let valueJsonData = clpConverter(productDataJson.currentPrice);

  htmlContent = `
  <h1>Hola Héctor!</h1>
  <p>El producto ${productNewData.title} cambio de valor.
  Paso de estar a <b>${valueJsonData}</b> a <b>${valueNewData}</b></p>
  <br>
  <p>Puedes revisarlo en el siguiente link ${productNewData.url}</p>
  `;
  sendEmail(htmlContent);
  console.log('Enviando email');
}

(async () => {
  for (const url of listadoUrls) {
    const product = await getProductPrice(url);
    if (product) {
      await updateProductList(product);
    }
  }
  console.log("Script ejecutado correctamente");
})();