const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
import { listadoUrls } from './ListadoUrlProductos';

const jsonFilePath = path.resolve(__dirname, 'productList.json');

async function getProductPrice(url) {
  let finalPrice = 0;
  let id = 0;
  let currentDate = generateCurrentDate();

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
      parcerPrice = cleanAndParseValue(productPrice);
      id = url.split('=')[1];
    } else {
      console.log('Error: no existe el valor');
    }

    //Generar json para almacenar
    let product = {
      id: id,
      title: title,
      currentPrice: parcerPrice,
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
    const currentProduct = products.find(p => p.id === product.id);

    if (currentProduct) {
      // Llamar a la función checkPrice si el producto ya existe
      checkPrice(currentProduct, product);
    } else {
      // Agregar el nuevo producto al array
      products.push(product);
      console.log('Producto nuevo agregado:', product);
    }

    // Escribir los datos actualizados de vuelta en el archivo JSON
    fs.writeFileSync(jsonFilePath, JSON.stringify(products, null, 2), 'utf-8');
    console.log('Archivo productList.json actualizado.');
  } catch (error) {
    console.error('Error updating product list:', error);
  }
}
function updateJson(product) {
  // Escribir los datos actualizados de vuelta en el archivo JSON
  fs.writeFileSync(jsonFilePath, JSON.stringify(product, null, 2), 'utf-8');
}

// Función checkPrice (defínela según tus necesidades)
function checkPrice(currentProduct, newProduct) {
  if (currentProduct.price != newProduct.price) {
    console.log(`El valor del producto ${currentProduct.title} cambio !`);
    console.log('Enviando email');
    updateJson(newProduct);
  }
}

function cleanAndParseValue(price) {
  let cleanValue = price.replace(/[^\d.,]/g, '').trim();
  let floatValue = parseFloat(cleanValue.replace('.', ''));
  return floatValue;
}

function generateCurrentDate(){
  let currentDate = new Date();

  // Formatear la fecha al estilo DD/MM/YYYY
  let day = String(currentDate.getDate()).padStart(2, '0');
  let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son de 0 a 11
  let year = currentDate.getFullYear();

  let formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}

(async () => {
  for (const url of listadoUrls) {
    const product = await getProductPrice(url);
    if (product) {
      await updateProductList(product);
    }
  }
})();