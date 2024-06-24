const generateCurrentDate = ()=>{
    let currentDate = new Date();
  
    // Formatear la fecha al estilo DD/MM/YYYY
    let day = String(currentDate.getDate()).padStart(2, '0');
    let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son de 0 a 11
    let year = currentDate.getFullYear();
  
    let formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

  module.exports = { generateCurrentDate };