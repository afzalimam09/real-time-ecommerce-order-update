import path from 'path';

import dotenv from 'dotenv-safe';

import express from "express";
import flash from 'express-flash';
import session from 'express-session';
import mongoStore from 'connect-mongodb-session';

import indexRouter from './components/indexRouter.js';

dotenv.config();

const __dirname = path.resolve();

const MongoDBStore = mongoStore(session);
const store = new MongoDBStore({
    uri: process.env.DB_URL,
    collection: 'sessions'
});

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 } // 30 days
}));
app.use(flash());

// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
});

app.use(indexRouter);


export default app;