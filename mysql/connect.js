import mysql from 'mysql2'; // Use promise-based library for async/await

async function connectToDatabase() {
  // Create the connection to the database
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'jiabaili',
  });

  try {
    // Check if the connection is working
    await connection.execute('SELECT 1');

    console.log('Connected to MySQL.');

    // Perform other database operations here

    // Add a sample product
    await addSampleProduct(connection);

  } catch (error) {
    console.error('Error connecting to MySQL or creating stored procedure: ', error);
  } finally {
    // Close the connection when done
    await connection.end();
    console.log('MySQL connection closed.');
  }
}

async function addSampleProduct(connection) {
  // Sample product data
  const sampleProduct = {
    name: 'Sample Product',
    surname: 'Sample Surname',
    location: 'Sample Location',
    quantity: 10,
  };

  try {
    // Insert the sample product into the 'products' table
    const result = await connection.execute(
      'INSERT INTO products (name, surname, location, quantity) VALUES (?, ?, ?, ?)',
      [sampleProduct.name, sampleProduct.surname, sampleProduct.location, sampleProduct.quantity]
    );

    console.log(`Sample product added with ID: ${result.insertId}`);
  } catch (error) {
    console.error('Error adding sample product: ', error);
  }
}
// Call the function to connect to the database and create the stored procedure
connectToDatabase();
