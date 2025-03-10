import { AppError } from "../../utils/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { deleteOne } from "../handlers/handlers.js";
import { User } from "../../../database/models/user.model.js";

const addUser = catchError(async (req, res) => {
    let user = new User(req.body);
    await user.save();
    res.status(201).json({ message: "user added successfully", user });
})
const allUsers = catchError(async (req, res, next) => {
    let users = await User.find()
    res.status(201).json({ message: "success", users });
})
const getUser = catchError(async (req, res, next) => {
    let user = await User.findById(req.params.id)
    user || next(new AppError('user not found', 404))
    !user || res.status(201).json({ message: "success", user });
})
const updateUser = catchError(async (req, res, next) => {
    if (req.body.slug) req.body.slug = slugify(req.body.name)
    if (req.file) req.body.logo = req.file.filename
    let user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    user || next(new AppError('user not found', 404))
    !user || res.status(201).json({ message: "success", user });
})
const deleteUser = deleteOne(User)

export {
    addUser,
    allUsers,
    getUser,
    updateUser,
    deleteUser
}
