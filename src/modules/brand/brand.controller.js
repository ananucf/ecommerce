import slugify from "slugify";
import { AppError } from "../../utils/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { Brand } from "../../../database/models/brand.model.js"
import { deleteOne } from "../handlers/handlers.js";

const addBrand = catchError(async (req, res) => {
    req.body.slug = slugify(req.body.name)
    req.body.logo = req.file.filename
    let brand = new Brand(req.body);
    await brand.save();
    res.status(201).json({ message: "brand added successfully", brand });
})
const allBrands = catchError(async (req, res, next) => {
    let brands = await Brand.find()
    res.status(201).json({ message: "success", brands });
})
const getbrand = catchError(async (req, res, next) => {
    let brand = await Brand.findById(req.params.id)
    brand || next(new AppError('brand not found', 404))
    !brand || res.status(201).json({ message: "success", brand });
})
const updatebrand = catchError(async (req, res, next) => {
    if (req.body.slug) req.body.slug = slugify(req.body.name)
    if (req.file) req.body.logo = req.file.filename
    let brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true })
    brand || next(new AppError('brand not found', 404))
    !brand || res.status(201).json({ message: "success", brand });
})
const deletebrand = deleteOne(Brand)

export {
    addBrand,
    allBrands,
    getbrand,
    updatebrand,
    deletebrand
}
