import slugify from "slugify";
import {Category} from "../../../database/models/category.model.js";
import { AppError } from "../../utils/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { deleteOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";


const addCategory = catchError(async (req, res) => {  
    req.body.slug = slugify(req.body.name)
    req.body.image = req.file.filename
    let category = new Category(req.body);
    await category.save();
    res.status(201).json({ message: "Category added successfully", category });
})
const allCategories = catchError(async (req, res, next) => {
        let apiFeatures = new ApiFeatures(Category.find(), req.query)
        .pagination().fields().filter().sort().search()
        let categories = await apiFeatures.mongooseQuery
        res.status(201).json({ message: "success", page: apiFeatures.pageNumber, categories });
})
const getCategory = catchError(async (req, res, next) => {
    let category = await Category.findById(req.params.id)
    category || next(new AppError('category not found', 404))
    !category || res.status(201).json({ message: "success", category });
})
const updateCategory = catchError(async (req, res, next) => {
    if (req.body.slug) req.body.slug = slugify(req.body.name)
    if (req.file) req.body.image = req.file.filename
    let category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
    category || next(new AppError('category not found', 404))
    !category || res.status(201).json({ message: "success", category });
})
const deleteCategory = deleteOne(Category)

export {
    addCategory,
    allCategories,
    getCategory,
    updateCategory,
    deleteCategory
}
