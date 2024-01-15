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

export const updatepos = async (req, res) => {
    try {
        const allProducts = await Product.find({}, { _id: 1, name:1, barcode: 1,categoryid: 1, details: 1, price: 1, category: 1, quantity: 1, discount: 1, vatcode: 1 }).exec();

        const productsWithDiscountStatus = await Promise.all(allProducts.map(async (product) => {
            const categoryDetails = await Category.findById(product.categoryid).exec();
            const categoryName = categoryDetails ? categoryDetails.name : 'Unknown Category';

            return {
                mongodbid: product._id.toString(),
                code: product.barcode,
                description: product.name,
                price: product.price,
                category: categoryName,
                qty: product.quantity,
                dis: product.discount ? 'YES' : 'NO',
                type: product.vatcode
            };
        }));

        await updateMySQLData(productsWithDiscountStatus);
        console.log('Data update in MySQL table is done.');
        // res.status(200).json(productsWithDiscountStatus);
    } catch (err) {
        console.error(err);
        // res.status(500).json({ error: "Internal Server Error" });
    }
};

async function updateMySQLData(products) {
    const updateQuery = 'UPDATE products SET qty = ? WHERE mongodbid = ?';

    await Promise.all(products.map(async (product) => {
        return new Promise((resolve, reject) => {
            pool.query(updateQuery, [product.qty, product.mongodbid], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }));
}