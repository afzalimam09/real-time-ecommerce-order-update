
const getCartPage = (req, res, next) => {
    res.render('shop/cart');
}

const addToCart = (req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = {
            items: {},
            totalQty: 0,
            totalPrice: 0
        }
    }

    let cart = req.session.cart;

    // Check if item does not exist in cart 
    if(!cart.items[req.body._id]) {
        cart.items[req.body._id] = {
            item: req.body,
            qty: 1
        }
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
    } else {
        cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice =  cart.totalPrice + req.body.price;
    }
    return res.json({ totalQty: req.session.cart.totalQty })
}

const deleteFromCart = (req, res, next) => {

    let cart = req.session.cart;
    delete cart.items[req.body.item._id];
    cart.totalQty -= req.body.qty;
    cart.totalPrice -= (req.body.qty * req.body.item.price);

    res.status(200).json({msg: 'success'});
}

export { getCartPage, addToCart, deleteFromCart };