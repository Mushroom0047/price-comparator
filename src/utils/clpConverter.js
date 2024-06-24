function clpConverter(value) {
    // Convertir el valor a una cadena
      let valueStr = value.toString();
  
      // Utilizar una expresión regular para agregar los puntos de mil
      valueStr = valueStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
      // Retornar el valor formateado con el símbolo de pesos chilenos
      return `$${valueStr} CLP`;
  }

  module.exports = { clpConverter };