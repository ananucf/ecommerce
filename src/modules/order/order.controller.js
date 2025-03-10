import { AppError } from "../../utils/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { Cart } from "../../../database/models/cart.model.js";
import { Order } from "../../../database/models/order.model.js";
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51R1ARzDl4o8OcT24TAtOcaqk7rLPKYJZZ7aSzDiwL1FEFSxuzQcan8CA5YiCGPdzLwg8czBGQy0H99897t39abxn001wiMMqYg');

const createCashOrder = catchError(async (req, res, next) => {
    //1-get user cart by cartId
    let cart = await Cart.findById(req.params.id)
    if (!cart) return next(new AppError('cart not found', 404))

    //2-total order price
    let totalOrderPrice = cart.totalCartPriceAfterDiscount || cart.totalCartPrice

    //3-create order
    let order = new Order({
        user: req.user._id,
        orderItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice
    })
    await order.save()

    //4-increment sold & decrement stock
    let optinos = cart.cartItems.map((prod) => {
        return (
            {
                updateOne: {
                    "filter": { _id: prod.product },
                    "update": { $inc: { sold: prod.quantity, stok: -prod.quantity } }
                }
            }
        )
    })
    await Product.bulkWrite(optinos)

    //5-clear user cart
    await Cart.findByIdAndDelete(cart._id)

    res.json({ message: "success", order })
})

const getUserOrders = catchError(async (req, res, next) => {
    let orders = await Order.findOne({ user: req.user._id }).populate('orderItems.product')
    res.json({ message: "success", orders })
})

const getAllOrders = catchError(async (req, res, next) => {
    let orders = await Order.find({})
    res.json({ message: "success", orders })
})

const createCheckOutSession = catchError(async (req, res, next) => {
    let cart = await Cart.findById(req.params.id)
    if (!cart) return next(new AppError('cart not found', 404))
        let totalOrderPrice = cart.totalCartPriceAfterDiscount || cart.totalCartPrice

    let session = await stripe.checkout.sessions.create({
        line_items:[
            {
                price_data: {
                    currency: 'egp',
                    unit_amount: totalOrderPrice * 100,
                    product_data: {
                        name: req.user.name
                    }
                },
                quantity: 1
            }
        ],
        mode: 'payment',
        success_url: "https://hambozoo.netlify.app/#/orders",
        cancel_url: "https://hambozoo.netlify.app/#/cart",

        customer_email: req.user.email,
        client_reference_id: req.params.id,
        metadata: req.body.shippingAddress
    })

    res.json({message: "success", session})
})


export {
    createCashOrder,
    getUserOrders,
    getAllOrders,
    createCheckOutSession
}
