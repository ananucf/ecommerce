import { catchError } from "../../middleware/catchError.js"
import { AppError } from "../../utils/appError.js"

export const deleteOne = (model) => {
    return catchError(async (req, res, next) => {
        let dodument = await model.findByIdAndDelete(req.params.id)
        dodument || next(new AppError('document not found', 404))
        !dodument || res.status(201).json({ message: "success", dodument });
    })
} 