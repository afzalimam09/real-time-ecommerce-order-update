import Product from "../../models/productModel.js";
import Order from '../../models/orderModel.js';
import moment from "moment";

const postAddProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getAdminOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({status: {$ne: 'completed'}}, null, { sort: { 'createdAt': -1 } }).populate('customerId', '-password');
        if(req.xhr) {
            return res.json(orders);
        } else {
            return res.render('admin/orders');
        }
    } catch (error) {
        res.redirect('/');
    }
}

const updateAdminOrders = async (req, res, next) => {
    try {
        const order = await Order.updateOne({_id: req.body.orderId}, {status: req.body.status});
        //Emit Event
        const eventEmitter = req.app.get('eventEmitter');
        eventEmitter.emit('orderUpdated', {id: req.body.orderId, status: req.body.status});
        return res.redirect('/admin/orders');
    } catch (error) {
        return res.redirect('/admin/orders');
    }
}

export { postAddProduct, getAdminOrders, updateAdminOrders };