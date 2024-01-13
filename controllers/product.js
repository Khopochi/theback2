import Category from "../models/Category.js"
import Deepcategory from "../models/Deepcategory.js"
import Product from "../models/Product.js"
import Subcategory from "../models/Subcategory.js"


//ADD PRODUCT FUNCTION
export const addProduct = async (req,res) => {
    const newProduct = Product(req.body)
    try{
        const savedProduct = await newProduct.save()
        res.status(200).json(savedProduct)
    }catch(err){
        res.status(200).json({err})   
    }
}

// Assuming you have a Product model defined somewhere in your code

// Import necessary modules and models


// Add a new function to count products with photos
export const countProducts = async (req, res) => {
    try {
        // Use the countDocuments method to count products with at least one photo
        const productsWithPhotosCount = await Product.countDocuments({ 'photos': { $exists: true, $ne: [] } });

        console.log(productsWithPhotosCount)
    } catch (err) {
        console.log(err)
    }
};


//get all products
export const getAllProducts = async (req, res) => {
    try {
      // Fetch all products
      const allProducts = await Product.find();
  
      // Initialize a variable to increment for each product
      let nextId = 1;
  
      // Create a promise array to fetch category, subcategory, and deep category names for each product
      const productPromises = allProducts.map(async (product) => {
        const categoryId = product.categoryid;
        const subCategoryId = product.subcategoryid;
        const deepCategoryId = product.deepcategoryid;
  
        // Fetch the category name based on the categoryId
        const category = await Category.findById(categoryId);
  
        // Fetch the subcategory name based on the subCategoryId
        const subcategory = await Subcategory.findById(subCategoryId);
  
        // Fetch the deep category name based on the deepCategoryId
        const deepcategory = await Deepcategory.findById(deepCategoryId);
  
        // Create an object with the required fields, including the incremented ID
        const productWithNames = {
          id: nextId++, // Increment and then use the incremented value
          name: product.name,
          categoryName: category ? category.name : 'Category Not Found',
          subcategoryName: subcategory ? subcategory.name : 'Subcategory Not Found',
          deepcategoryName: deepcategory ? deepcategory.name : 'Deepcategory Not Found',
          ...product._doc,
        };
  
        return productWithNames;
      });
  
      // Resolve all promises and get the final array with category, subcategory, and deep category names
      const productsWithNames = await Promise.all(productPromises);
  
      // Send the modified JSON response with added id, categoryName, subcategoryName, and deepcategoryName fields
      res.status(200).json(productsWithNames);
    } catch (err) {
      // Handle errors and send an error response
      res.status(500).json({ error: 'Operation Failed', errorDetails: err.message });
    }
  };

//get products that match deepcategoryid
export const getProductsByDeepCategoryId = async (req, res) => {
  const deepcategoryid = req.params.id;

  try {
    // Find products with the specified deepCategoryId
    const products = await Product.find({ deepcategoryid, photos: { $exists: true, $ne: [] } });
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//get single product
export const getProductById = async (req, res) => {
  const productId = req.params.id; 
  try {
    const product = await Product.findById(productId); 
    res.status(200).json(product);
  } catch (err) {
    res.status(200).json({ error: 'Internal Server Error' });
  }
};

//get all products for home page


export const getProducts = async (req, res) => {
  try {
    // Sample 10 products with images from the database
    const products = await Product.aggregate([
      {
        $match: {
          photos: { $exists: true, $ne: [] } // Only select products with non-empty photos array
        }
      },
      {
        $sample: { size: 10 } // Sample 10 products (adjust the size as needed)
      }
    ]).exec();

    res.status(200).json(products);
  } catch (err) {
    // Handle errors and return an empty array
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



//get prodyct by barcode
export const getProductsByBarcode = async (req, res) => {
  const barcode = req.params.barcode;
  try {
    const products = await Product.find({ barcode });

    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(200).json({ message: 'No' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Update product based on ID
export const updateProductById = async (req, res) => {
  const productId = req.params.id;
  console.log(req.body)
  try {
      // Find the product by ID and update it with the request body
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {$set: req.body}, {new:true});

      // Check if a product with the specified ID was found and updated
      if (updatedProduct) {
          res.status(200).json(updatedProduct);
      } else {
          res.status(404).json({ message: 'Product not found' });
      }
  } catch (err) {
      // Handle errors
      res.status(500).json({ error: 'Internal Server Error' });
  }
};


//get mastrcalss dope thing
// Route to get array of categories with subcategories and products
// export const getCategoriesWithProducts = async (req, res) => {
//   try {
//     const categories = await Category.find().lean();

//     const categoriesWithProducts = await Promise.all(
//       categories.map(async (category) => {
//         const subcategories = await Subcategory.find({ categoryyid: category._id }).limit(10).lean();
//         const products = await Product.find({ categoryid: category._id }).limit(6).lean();

//         return {
//           category: category,
//           subcategories: subcategories,
//           products: products,
//         };
//       })
//     );

//     res.status(200).json(categoriesWithProducts);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// export const getCategoriesWithProducts = async (req, res) => {
//   try {
//     const categories = await Category.find().lean();

//     const categoriesWithProducts = await Promise.all(
//       categories.map(async (category) => {
//         const subcategories = await Subcategory.find({ categoryyid: category._id }).limit(10).lean();
//         const products = await Product.find({ categoryid: category._id }).limit(6).lean();

//         // Enhance the products array with deep category name
//         const productsWithDeepCategoryName = await Promise.all(
//           products.map(async (product) => {
//             const deepCategory = await Deepcategory.findById(product.deepcategoryid).lean();
//             const deepCategoryName = deepCategory ? deepCategory.name : null;

//             return {
//               ...product,
//               deepCategoryName,
//             };
//           })
//         );

//         return {
//           category: category,
//           subcategories: subcategories,
//           products: productsWithDeepCategoryName,
//         };
//       })
//     );

//     res.status(200).json(categoriesWithProducts);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



export const getCategoriesWithProducts = async (req, res) => {
  try {
    // Fetch all categories
    const categories = await Category.find();

    // Sort categories based on the number of products with images
    const sortedCategories = await Promise.all(
      categories.map(async (category) => {
        const count = await Product.countDocuments({
          categoryid: category._id,
          photos: { $elemMatch: { $exists: true, $ne: [] } }
        });

        return { category, count };
      })
    );

    sortedCategories.sort((a, b) => b.count - a.count);

    // Fetch details for each category
    const categoriesWithProducts = await Promise.all(
      sortedCategories.map(async ({ category }) => {
        const subcategories = await Subcategory
          .find({ categoryyid: category._id })
          .limit(10)
          .lean();

        const totalProducts = await Product.countDocuments({
          categoryid: category._id,
          photos: { $elemMatch: { $exists: true, $ne: [] } }
        });

        const randomSkip = totalProducts > 6 ? Math.floor(Math.random() * (totalProducts - 6)) : 0;

        // Fetch products with images in the photos array
        const products = await Product.find({
          categoryid: category._id,
          photos: { $exists: true, $ne: [] }, // Only select products with non-empty photos array
        })
        .skip(randomSkip)
        .limit(6)
        .select('-__v') // Exclude the version key if it exists
        .lean();

        // Fetch deep category ids
        const deepCategoryIds = products.map(product => product.deepcategoryid);

        // Fetch deep categories in parallel
        const deepCategories = await Deepcategory.find({ _id: { $in: deepCategoryIds } }).lean();
        const deepCategoryMap = deepCategories.reduce((acc, dc) => ({ ...acc, [dc._id]: dc.name }), {});

        // Enhance the products array with deep category name
        const productsWithDeepCategoryName = products.map(product => ({
          ...product,
          deepCategoryName: deepCategoryMap[product.deepcategoryid] || null,
        }));

        return {
          category: category.toObject(), // If necessary, convert to a plain JS object
          subcategories,
          products: productsWithDeepCategoryName,
        };
      })
    );

    res.status(200).json(categoriesWithProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




//shaffled products
// Assuming you have a Product model defined
// const Product = require('../models/Product'); // Import your Product model

// Function to get products based on price range and quantity
export const getProductsShuffle = async (req, res) => {
  try {
    let products;

    // First attempt to get products between 10000 and 50000
    products = await Product.aggregate([
      { $match: { price: { $gte: 5000, $lte: 10000 }, photos: { $exists: true, $ne: [] } } },
      { $sample: { size: 10 } },
    ]);

    // If there are less than 10 products, try a lower price range
    if (products.length < 10) {
      const additionalProductsCount = 10 - products.length;

      const additionalProducts = await Product.aggregate([
        { $match: { price: { $gte: 3000, $lte: 5000 }, photos: { $exists: true, $ne: [] } } },
        { $sample: { size: additionalProductsCount } },
      ]);

      products = [...products, ...additionalProducts];
    }

    res.status(200).json(shuffleArray(products));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


//fetch again
export const searchProducts = async (req, res) => {
  const searchTerm = req.params.searchterm;
  const ids = req.params.id;
  const array = ids.split(",");
  console.log(searchTerm)

  try {
    // Find categories that match the search term
    const matchingCategories = await Category.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        // Add additional fields for subcategory and deep category as needed
      ],
    }).select('_id');

    // Extract the IDs from the matching categories
    const categoryIds = matchingCategories.map(category => category._id);

    // Find subcategories that match the search term
    const matchingSubcategories = await Subcategory.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        // Add additional fields for subcategory and deep category as needed
      ],
    }).select('_id');

    // Extract the IDs from the matching subcategories
    const subcategoryIds = matchingSubcategories.map(subcategory => subcategory._id);

    // Find deep categories that match the search term
    const matchingDeepCategories = await Deepcategory.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        // Add additional fields for subcategory and deep category as needed
      ],
    }).select('_id');

    // Extract the IDs from the matching deep categories
    const deepCategoryIds = matchingDeepCategories.map(deepCategory => deepCategory._id);

    // Find products based on the search term and matching category, subcategory, and deep category IDs
    const products = await Product.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' },photos: { $exists: true, $ne: [] },_id: { $nin: array }  }, // Case-insensitive search in name
        { details: { $regex: searchTerm, $options: 'i' },photos: { $exists: true, $ne: [] },_id: { $nin: array }  }, // Case-insensitive search in details
        { categoryid: { $in: categoryIds },photos: { $exists: true, $ne: [] },_id: { $nin: array }  }, // Match products with matching category IDs
        { subcategoryid: { $in: subcategoryIds },photos: { $exists: true, $ne: [] },_id: { $nin: array }  }, // Match products with matching subcategory IDs
        { deepcategoryid: { $in: deepCategoryIds },photos: { $exists: true, $ne: [] },_id: { $nin: array }  }, // Match products with matching deep category IDs
      ],
    }).limit(16);

    res.status(200).json(products);
  } catch (err) {
    res.status(200).json({ error: err.message });
  }
};


//for category
export const searchProductsCategory = async (req, res) => {
  const catid = req.params.catid;
  const ids = req.params.id;
  const array = ids.split(",");

  try {
    const products = await Product.find({
      categoryid: catid,
      _id: { $nin: array },
      photos: { $elemMatch: { $exists: true, $ne: [] } }
    }).limit(16);

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//sub category
//for category
export const searchProductsSub = async (req, res) => {
  const catid = req.params.catid;
  const ids = req.params.id;
  const array = ids.split(",");

  try {
    const products = await Product.find({
      subcategoryid: catid,
      _id: { $nin: array },
      photos: { $exists: true, $ne: [] }
    }).limit(12);

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



