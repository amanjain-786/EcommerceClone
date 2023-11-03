import categoryModel from "../models/categoryModel.js";
import slugify from 'slugify'

export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(401).send({
                message: "name is required"
            })
        }

        //checking existing category
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            res.status(200).send({
                success: true,
                message: "category already exist"
            })
        }
        //i.e nahi hai so we make and save a new category bro
        const category = new categoryModel({
            name: name,
            slug: slugify(name)
        })
        await category.save();
        res.status(201).send({
            success: true,
            message: "new category created",
            category
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            err,
            message: "error in category addition"
        })
    }
}


//update category
export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await categoryModel.findByIdAndUpdate(
            id,
            { name, slug: slugify(name) },
            { new: true }
        );
        res.status(200).send({
            success: true,
            messsage: "Category Updated Successfully",
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while updating category",
        });
    }
};


//get all categories
export const categoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: "all categories list",
            category
        })
    }
    catch (err) {
        console.log(err);
        res.send(500).send({
            success: false,
            err,
            message: "error while getting all categories"
        })
    }
}


//single category
// single category
export const singleCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        res.status(200).send({
            success: true,
            message: "Get SIngle Category SUccessfully",
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error While getting Single Category",
        });
    }
};

//delete category
export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "category deleted successfully"
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "error while deleting category",
            err
        })
    }
}