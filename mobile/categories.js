import Category from "../models/Category.js";
import Deepcategory from "../models/Deepcategory.js";
import Product from "../models/Product.js";
import Subcategory from "../models/Subcategory.js";

export const fetchCategoriesWithImages = async (req,res) => {
    try {
      // Fetch all categories
      const allCategories = await Category.find();
  
      // Fetch subcategories with products having images
      const subcategoriesWithImages = await Product.aggregate([
        {
          $match: {
            'photos.0': { $exists: true },
            'subcategoryid': { $exists: true },
          },
        },
        {
          $group: {
            _id: '$subcategoryid',
          },
        },
      ]);
  
      // Fetch deep categories with products having images
      const deepCategoriesWithImages = await Product.aggregate([
        {
          $match: {
            'photos.0': { $exists: true },
            'deepcategoryid': { $exists: true },
          },
        },
        {
          $group: {
            _id: '$deepcategoryid',
            photos: { $push: '$photos' },
            randomProduct: { $push: '$$ROOT' },
          },
        },
        {
          $lookup: {
            from: 'deepcategories', // Replace with the actual collection name
            localField: '_id',
            foreignField: '_id',
            as: 'deepcategoryy',
          },
        },
        {
          $set: {
            joinedData: {
              _id: '$$ROOT._id',
              photos: '$photos',
              deepcategory: { $arrayElemAt: ['$deepcategoryy', 0] },
            },
          },
        },
        {
          $project: {
            _id: '$joinedData._id',
            photos: { $arrayElemAt: ['$joinedData.photos', { $floor: { $multiply: [{ $rand: {} }, { $size: '$joinedData.photos' }] } }] },
            deepcategoryName: '$joinedData.deepcategory.name',
          },
        },
      ]);
      
      //console.log('deepCategoriesWithImages:', deepCategoriesWithImages);
      
        
      // Now you have arrays of subcategory IDs and deep category IDs with at least one product having an image
  
      // Fetch actual subcategory and deep category documents based on IDs
      const subcategories = await Subcategory.find({ _id: { $in: subcategoriesWithImages.map(s => s._id) } });
      const deepCategories = await Deepcategory.find({ _id: { $in: deepCategoriesWithImages.map(d => d._id) } });

  
      res.status(200).json({ categories: allCategories, subcategories, deepCategoriesWithImages });
    } catch (err) {
      //console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };






  export const getDeepCategories = async (req, res) => {
    try {
      // Find products with at least one image in the photos array
      const productsWithPhotos = await Product.find({
        'photos.0': { $exists: true },
      });
  
      // Extract unique deepcategory values from the filtered products
      const uniqueDeepCategories = [...new Set(productsWithPhotos.map(product => product.deepcategoryid))];
  
      // Fetch deep categories based on the filtered product ids
      const deepCategories = await Deepcategory.find({
        _id: { $in: uniqueDeepCategories },
      }, { name: 1, _id: 1, subcategoryid: 1 });
  
      return res.status(200).json(deepCategories);
    } catch (error) {
      //console.error('Error fetching deep categories:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  