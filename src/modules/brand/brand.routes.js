import { Router } from "express"
import { addBrand, allBrands, deletebrand, getbrand, updatebrand } from "./brand.controller.js"
import { uploadSingleFile } from "../../fileUpload/fileUpload.js"

const brandRouter = Router()
brandRouter
    .route('/')
    .post(uploadSingleFile('logo', 'brands'), addBrand)
    .get(allBrands)
brandRouter
    .route('/:id')
    .get(getbrand)
    .put(uploadSingleFile('logo', 'brands'), updatebrand)
    .delete(deletebrand)

export default brandRouter