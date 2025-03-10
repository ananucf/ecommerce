import mongoose, {Types} from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'name is required'],
        trim: true,
        required: true,
        minLength: [2, 'to short category name']
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    },
    logo: String,
    createdBy: {
        type: Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true, versionKey: false })

schema.post('init', function (doc) {
    doc.logo = process.env.BASE_URL + "brands/" + doc.logo
})

export const Brand = mongoose.model('Brand', schema)