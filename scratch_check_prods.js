const { products } = require('./src/data/products.js');
console.log('Total products currently in products.js:', products.length);
products.forEach((p, i) => {
  console.log(`${i + 1}. [${p.categoryCode}] ${p.name} (${p.sku})`);
});
