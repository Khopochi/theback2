const mysql = require('mysql2');
const MongoClient = require('mongodb').MongoClient;

// MySQL Connection Configuration
const mysqlConfig = {
  host: 'your_mysql_host',
  user: 'your_mysql_user',
  password: 'your_mysql_password',
  database: 'your_mysql_database',
};

// MongoDB Connection Configuration
const mongoDBUrl = 'mongodb://your_mongodb_host:your_mongodb_port/your_mongodb_database';

// Create MySQL connection pool
const mysqlPool = mysql.createPool(mysqlConfig);

// Create MongoDB client
const mongoClient = new MongoClient(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MySQL and MongoDB
mysqlPool.getConnection((err, connection) => {
  if (err) throw err;

  mongoClient.connect((err) => {
    if (err) throw err;

    // Watch for updates on the 'products' table
    const query = connection.query('SELECT * FROM products WHERE quantity <> OLD.quantity');
    const changeStream = query.stream();

    changeStream.on('data', (row) => {
      // Handle the updated product in MongoDB
      updateMongoDB(row.product_id, row.quantity);
    });

    changeStream.on('end', () => {
      connection.release();
      mongoClient.close();
    });
  });
});

// Update MongoDB based on the product ID
function updateMongoDB(productId, newQuantity) {
  // Implement your MongoDB update logic here
  // Connect to MongoDB, find the document with the given productId, and update the quantity field
  // Example using MongoDB native driver:
  // mongoClient.db('your_mongodb_database').collection('your_collection').updateOne({ product_id: productId }, { $set: { quantity: newQuantity } });
}
