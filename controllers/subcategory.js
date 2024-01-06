import Category from "../models/Category.js"
import Deepcategory from "../models/Deepcategory.js"
import Product from "../models/Product.js"
import Subcategory from "../models/Subcategory.js"


//ADD Subcategory FUNCTION
export const addSubcategory = async (req,res) => {
    const newSubcategory = Subcategory(req.body)
    try{
        const savedSubcategory = await newSubcategory.save()
        res.status(200).json(savedSubcategory)
    }catch(err){
        res.status(200).json({error: "Operation Failed", errorDetails: err}) 
    }
}

//UPDATE Subcategory
export const updateSubcategory = async (req, res) => {
    try {
        // Update Subcategory in the database
        const updatedSubcategory = await Subcategory.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

        // Update products with the old category ID to the new category ID
        const updatedProducts = await Product.updateMany(
            { subcategoryid: req.params.id }, // Find products with the old category ID
            { $set: { categoryid: req.body.categoryyid } } // Set the category ID to the new category ID
        );

        res.status(200).json(updatedSubcategory);
    } catch (err) {
        res.status(500).json({ error: "Operation Failed", errorDetails: err });
    }
};


//DELETE Subcategory
export const deleteSubcategory = async (req, res) => {
    try {
        // Check if deep categories exist for the given subcategory id
        const deepCategoriesExist = await Deepcategory.exists({ subcategoryid: req.params.id });

        if (deepCategoriesExist) {
            // Deep categories exist, retrieve and return their details
            const deepCategories = await Deepcategory.find({ subcategoryid: req.params.id });

            res.status(200).json({
                message: "Deep categories exist under this subcategory",
                deepCategories: deepCategories.map(deepCategory => ({
                    id: deepCategory._id,
                    name: deepCategory.name
                }))
            });
        } else {
            // No deep categories exist, delete the subcategory
            await Subcategory.findByIdAndDelete(req.params.id);
            res.status(200).json({ success: "Subcategory has been deleted" });
        }
    } catch (err) {
        res.status(500).json({ error: "Operation Failed", errorDetails: err });
    }
};





//GET SINGLE Subcategory
export const getSingleSubcategory = async (req,res) => {
    try{
        //savr Subcategory in database
        const singlSubcategory = await Subcategory.findById(req.params.id)
        res.status(200).json(singlSubcategory)
        }catch(err){
            res.status(200).json({error: "Operation Failed", errorDetails: err})
        }
}

//GET ALL SUB CATEGORIES
export const getAllSubCategories = async (req, res) => {
    let nextId = 1;
    try {
        // Fetch all subcategories based on the request query
        const allSubCategories = await Subcategory.find(req.query);

        // Create a promise array to fetch category names for each subcategory
        const categoryPromises = allSubCategories.map(async subcategory => {
            const categoryId = subcategory.categoryyid;

            // Fetch the category name based on the categoryId
            const category = await Category.findById(categoryId);
            return {
                id: nextId++, // Incremented unique ID
                categoryName: category ? category.name : 'Category Not Found',
                ...subcategory._doc,
            };
        });

        // Resolve all promises and get the final array with category names
        const categoriesWithNames = await Promise.all(categoryPromises);

        // Send the modified JSON response with added id and categoryName fields
        res.status(200).json(categoriesWithNames);
    } catch (err) {
        // Handle errors and send an error response
        res.status(500).json({ error: "Operation Failed", errorDetails: err });
    }
};


//GET SUBCATEGORIES FOR SPECIFIC CATEGORY
export const getSpecificCategory = async (req,res) => {
    const id = req.params.id
    try{
        const specificSubcategories = await Subcategory.find({ categoryyid: id });
        res.status(200).json(specificSubcategories);
    }catch(err){
        console.error('Error in getSpecificCategory:', err);
        res.status(500).json({ error: 'Internal Server Error', errorDetails: err });
    }
}

//SIM0PLIEFIED GET
export const getAllSubDeep = async (req,res) => {
    try{
        const allCategories = await Subcategory.find(req.query)
        res.status(200).json(allCategories)
        }catch(err){
            res.status(200).json({error: "Operation Failed", errorDetails: err})
        }
}


export const getCategoriesByTerm2 = async (req, res) => {
    try {
      const term = req.params.term;
  
      // Case-insensitive regular expression for matching the term in the name field
      const regex = new RegExp(term, 'i');
  
      // Find deep categories that match the search term
      const matchingDeepCategories = await Subcategory.find({ name: regex });
  
      // Create an array to store the final result with category and subcategory names
      const result = [];
  
      // Loop through each matching deep category
      for (const deepCategory of matchingDeepCategories) {
        // Extract categoryId and subcategoryId from the deep category record
        const { categoryyid } = deepCategory;
  
        // Fetch the category and subcategory names using the IDs
        const category = await Category.findById(categoryyid);

  
        // Build the final result object with all deep category attributes and added names
        const finalResult = {
          ...deepCategory.toObject(), // Include all deep category attributes
          categoryName: category ? category.name : null
        };
  
        // Push the result object to the array
        result.push(finalResult);
      }
  
      // Send the final result as JSON response
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: "Operation Failed", errorDetails: err });
    }
  };
  

