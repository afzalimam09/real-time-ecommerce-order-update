import mongoose from "mongoose";
import db from '../connections/dbConnections.js';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'User must have a name']
    },
    email: {
        type: String,
        required: [true, 'User must have a email']
    },
    password: {
        type: String,
        required: [true, 'User must have password']
    },
    isAdmin: {
        type: Boolean,
        default: false
    }

});

export default db.model('User', userSchema);