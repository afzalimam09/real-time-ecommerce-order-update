import Order from '../../models/orderModel.js';
import moment from 'moment';


const getCheckout = async (req, res, next) => {
    if(req.session.cart && req.session.cart.totalQty > 0) {
        res.render("shop/checkout");
    } else {
        res.redirect('/cart');
    }
}

const placeOrder = async (req, res, next) => {
    const { name, street, town, state, pincode, phone } = req.body;

    const address = `${name}, ${street}, ${town}, ${state} - ${pincode}`;

    const newOrder = new Order({
        customerId: req.session.user._id,
        items: req.session.cart.items,
        phone,
        address
    });

    try {
        const order = await newOrder.save();
        
        const placedOrder = await Order.populate(order, { path: 'customerId' });
        req.flash('orderplaced', true);
        delete req.session.cart;
        //Emit Event
        const eventEmitter = req.app.get('eventEmitter');
        eventEmitter.emit('orderPlaced', placedOrder);

        res.redirect('/order-placed');
        
    } catch (error) {
        console.log(error);
        res.redirect('/cart');
    }

}

const orderPlaced = (req, res, next) => {
    res.render('shop/order-placed');
}

const getOrderHistory = async (req, res, next) => {
    try {
        const orders = await Order.find({ customerId: req.session.user._id }, null, {sort: {'createdAt': -1}});
        // console.log(orders);
        res.render('shop/orders', {orders, moment});

    } catch (error) {
        console.log(error)
    }
}

const getSingleOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if(req.session.user._id.toString() === order.customerId.toString()){
            return res.render('shop/singleOrder', {order});
        } 
        return res.redirect('/orders');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}

export { getCheckout, placeOrder, orderPlaced, getOrderHistory, getSingleOrder };