import Category from "../models/Category.js";
import Product from "../models/Product.js";
import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jiabaili',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const updateProductById = async (req, res) => {
    const productId = req.params.id;

    try {
        // Find the product by ID and update it with the request body
        const updatedProduct = await Product.findByIdAndUpdate(productId, {$set: req.body}, {new: true});

        // Check if a product with the specified ID was found and updated
        if (updatedProduct) {
            // Update the product in the MySQL products table
            await updateProductInMySQL(updatedProduct);

            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        // Handle errors
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

async function updateProductInMySQL(product) {
    const updateQuery = 'UPDATE products SET code = ?, description = ?, price = ?, category = ?, qty = ?, dis = ?, type = ? WHERE mongodbid = ?';

    const categoryDetails = await Category.findById(product.categoryid).exec();
    const categoryName = categoryDetails ? categoryDetails.name : 'Unknown Category';

    return new Promise((resolve, reject) => {
        pool.query(updateQuery, [product.barcode, product.name, product.price, categoryName, product.quantity, product.disc ? 'YES' : 'NO', product.vatcode, product._id.toString()], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}
