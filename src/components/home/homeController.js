import Product from '../../models/productModel.js';

const getHomePage = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render("shop/home", {products});
    } catch (error) {
        console.log(error)
    }
}

export { getHomePage };