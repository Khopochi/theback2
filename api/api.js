import Category from "../models/Category.js";
import Product from "../models/Product.js";

export const getAllProducts = async (req, res) => {
    try {
        const allProducts = await Product.find({}, { _id: 1, barcode: 1,categoryid: 1, details: 1, price: 1, category: 1, quantity: 1, discount: 1, vatcode: 1 }).limit(10).exec();

        const productsWithDiscountStatus = await Promise.all(allProducts.map(async (product) => {
            const categoryDetails = await Category.findById(product.categoryid).exec();
            const categoryName = categoryDetails ? categoryDetails.name : 'Unknown Category';

            return {
                productid: product._id.toString(),
                code: product.barcode,
                description: product.details,
                price: product.price,
                category: categoryName,
                qty: product.quantity,
                dis: product.discount ? 'YES' : 'NO',
                taxtype: product.vatcode
            };
        }));

        console.log(productsWithDiscountStatus);
        // res.status(200).json(productsWithDiscountStatus);
    } catch (err) {
        console.error(err);
        // res.status(500).json({ error: "Internal Server Error" });
    }
};
