require('dotenv').config();
const fs = require('fs');
const puppeteer = require('puppeteer');

const listOfProducts = [
  'https://lk.cl/#!/Producto=14065',
  'https://lk.cl/#!/Producto=13913',
];

async function getProductPrice(urls) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (const url of urls) {
      await page.goto(url);

      // Wait for the target element to be loaded (adjust selector if needed)
      await page.waitForSelector(
        '#DetalleProducto');
      const elemento = await page.$(`#DetalleProducto.Detalle`);
      const contenido = await elemento.evaluate(el => el.textContent);
  
      console.log(`Contenido de ${url}: ${contenido}`);
    }
  } catch (error) {
    console.error('Error fetching the product price:', error);
  }
}

function addToJson(productData) {
  const jsonData = JSON.stringify(productData, null, 2);
  const filePath = 'products.json'; // Replace with desired filename

  fs.writeFile(filePath, jsonData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to JSON file:', err);
    } else {
      console.log('Product data successfully written to JSON file.');
    }
  });
}

(async () => {
  try {
    await getProductPrice(listOfProducts); // Call getProductPrice once
  } catch (error) {
    console.error('Error:', error);
  }
})();