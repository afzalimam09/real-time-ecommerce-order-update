import mongoose from "mongoose";
import db from '../connections/dbConnections.js';

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Product must have a name']
    },
    image: {
        type: String,
        required: [true, 'Product must have a name']
    },
    price: {
        type: Number,
        required: [true, 'Product must have price']
    },
    stock: {
        type: Boolean,
        required: [true, 'Stock is required!'],
        default: true
    } 
});

export default db.model('Product', productSchema);