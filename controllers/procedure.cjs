// import path from 'fs'
const path = require('path');


// root/jiabaili/api/controllers/update.js
const productId = process.argv[2];
const newQuantity = process.argv[3];

// Your update logic here using productId and newQuantity
console.log(`Updating product ID ${productId} with new quantity ${newQuantity}`);


const procedureScriptPath = path.join(__dirname, 'procedure.cjs');

// Log the path to the console
console.log('Path to MySQL procedure script:', procedureScriptPath);
