function cleanAndParseValue(price) {
    let cleanValue = price.replace(/[^\d.,]/g, '').trim();
    let floatValue = parseFloat(cleanValue.replace('.', ''));
    return floatValue;
  }

  module.exports = { cleanAndParseValue };