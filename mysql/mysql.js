// Import the mysql2 library
// const mysql = require('mysql2');
import mysql from 'mysql2'

// Create a connection pool
// Create a connection pool
const pool = mysql.createPool({
    host: '192.168.1.172',  // Replace with your MySQL server IP
    user: 'kondwani',           // Replace with your MySQL username
    password: 'kho_2000-Paul@zola', // Replace with your MySQL password
    database: 'jiabaili',    // Replace with your MySQL database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });


  // const pool = mysql.createPool({
  //   host: 'localhost',  // Replace with your MySQL server IP
  //   user: 'root',           // Replace with your MySQL username
  //   password: '', // Replace with your MySQL password
  //   database: 'jiabaili',    // Replace with your MySQL database name
  //   waitForConnections: true,
  //   connectionLimit: 10,
  //   queueLimit: 0
  // })b
  
  // SQL query to create the table
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id INT PRIMARY KEY AUTO_INCREMENT,
      item_number INT,
      code VARCHAR(255),
      mongodbid VARCHAR(255),
      description VARCHAR(255),
      type VARCHAR(255),
      price DOUBLE,
      category VARCHAR(255),
      qty DOUBLE,
      dis VARCHAR(255),
      tax DOUBLE,
      taxtype CHAR,
      taxrate DOUBLE,
      total_price DOUBLE
    )
  `;
  
  // Execute the query to create the table
  pool.query(createTableQuery, (error, results, fields) => {
    if (error) {
      console.error('Error creating table:', error);
      throw error;
    }
  
    console.log('Table created successfully.');
  
    // Release the connection back to the pool
    pool.end();
  });

  // Sample product data
const sampleProduct = {
  name: 'Sample Product',
  barcode: '123456789',
  details: 'This is a sample product for testing purposes.',
  searchtem: 'Sample',
  brand: 'Sample Brand',
  material: 'Sample Material',
  color: 'Sample Color',
  producttype: 'Sample Type',
  appearance: 'Sample Appearance',
  price: 19.99,
  photos: ['photo1.jpg', 'photo2.jpg'],
  quantity: 100,
  categoryid: '1',
  subcategoryid: '2',
  deepcategoryid: '3',
  disc: true,
  vat: true,
  discount: 5.00,
  weight: 1.5
};

// // SQL query to insert the sample product into the table
// const insertProductQuery = `
//   INSERT INTO myproducts SET ?
// `;

// // Convert the photos array to a JSON string using JSON_ARRAY function
// sampleProduct.photos = JSON.stringify(sampleProduct.photos);

// // Execute the query to insert the sample product
// pool.query(insertProductQuery, sampleProduct, (error, results, fields) => {
//   if (error) {
//     console.error('Error inserting sample product:', error);
//     throw error;
//   }

//   console.log('Sample product added successfully.');

//   // Release the connection back to the pool
//   pool.end();
// });

// Update the quantity of the product with ID 1 to 8
// const updateQuantityQuery = `
//   UPDATE myproducts
//   SET quantity = 7
//   WHERE id = 1;
// `;

// // Execute the query to update the quantity
// pool.query(updateQuantityQuery, (error, results, fields) => {
//   if (error) {
//     console.error('Error updating quantity:', error);
//     throw error;
//   }

//   console.log('Quantity updated successfully.');

//   // Release the connection back to the pool
//   pool.end();
// });

  