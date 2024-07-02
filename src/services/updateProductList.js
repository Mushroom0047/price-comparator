const { sendEmailToUser } = require('./sendEmail');
const { createLogMessage } = require('../utils/createLog');
const fs = require('fs');
const path = require('path');
const jsonFilePath = path.resolve(__dirname, '..', 'assets', 'productList.json');

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
  }

  module.exports = { updateProductList };