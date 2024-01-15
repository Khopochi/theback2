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

export const getAllProducts = async (req, res) => {
    try {
        // Truncate the products table to remove existing data

        const allProducts = await Product.find({}, { _id: 1, name: 1, barcode: 1, categoryid: 1, details: 1, price: 1, category: 1, quantity: 1, disc: 1, vatcode: 1 }).exec();

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
                dis: product.disc ? 'YES' : 'NO',
                type: product.vatcode
            };
        }));

        await truncateProductsTable();
        console.log("trun done")


        await insertIntoMySQL(productsWithDiscountStatus);
        console.log('Data insertion into MySQL table is done.');
        res.status(200).json("done");
    } catch (err) {
        console.error(err);
        // res.status(500).json({ error: "Internal Server Error" });
        res.status(200).json("error");

    }
};

async function truncateProductsTable() {
    const truncateQuery = 'TRUNCATE TABLE products';

    return new Promise((resolve, reject) => {
        pool.query(truncateQuery, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

async function insertIntoMySQL(products) {
    const insertQuery = 'INSERT INTO sales_buffer (mongodbid, code, description, price, category, qty, dis, type) VALUES ?';

    const values = products.map(product => [
        product.mongodbid,
        product.code,
        product.description,
        product.price,
        product.category,
        product.qty,
        product.dis,
        product.type
    ]);

    return new Promise((resolve, reject) => {
        pool.query(insertQuery, [values], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}
