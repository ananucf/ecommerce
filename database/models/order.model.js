import mongoose, { Types } from "mongoose";

const schema = new mongoose.Schema({

    user: { type: Types.ObjectId, ref: 'user' },
    orderItems: [
        {
            product: { type: Types.ObjectId, ref: 'Product' },
            quantity: Number,
            price: Number
        }
    ],
    totalCartPrice: Number,
    shippingAddress: {
        city: String,
        street: String,
        phone: String
    },
    payment: { 
        type: String,
        enum: ['cash', 'card'],
        default: 'cash'
    },
    isPayed: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: Date

}, { timestamps: true, versionKey: false })

export const Order = mongoose.model('Order', schema)