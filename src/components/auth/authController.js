import bcrypt from 'bcryptjs';
import User from '../../models/userModel.js';

const getSignup = (req, res, next) => {
    if(req.session.isLoggedIn) {
        return res.redirect('/');
    }
    res.render('auth/signup');
}

const getLogin = (req, res, next) => {
    if(req.session.isLoggedIn) {
        return res.redirect('/');
    }
    res.render('auth/login');
}

const postSignup = async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;
    
    //Validate request
    if(!name || !email || !password || !confirmPassword) {
        req.flash('error', 'All fields are required!');
        req.flash('name', name);
        req.flash('email', email);
        return res.redirect('/signup');
    }

    //Check if password and confirm password are same
    if(password !== confirmPassword) {
        req.flash('error', 'Password and confirm password should be same');
        req.flash('name', name);
        req.flash('email', email);
        req.flash('type', 'confirmPs');
        return res.redirect('/signup');
    }

    //Check if email already exists
    try {
        const user = await User.findOne({email});
        if(user) {
            req.flash('error', 'Email already exist!');
            req.flash('name', name);
            req.flash('email', email);
            req.flash('type', 'email-exist')
            return res.redirect('/signup');
        }
    } catch (error) {
        req.flash('error', 'Something went wrong!');
        console.log(error)
        return res.redirect('/signup');
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
        name,
        email, 
        password: hashedPassword
    });
    try {
        await user.save();
        return res.redirect('/login');
    } catch (error) {

        req.flash('error', 'Something went wrong!');
        console.log(error)
        return res.redirect('/signup');
    }
    
}

const postLogin = async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) {
        req.flash('error', 'All fields are required!');
        req.flash('email', email);
        return res.redirect('/login');
    }

    try {
        const user = await User.findOne({email: email});
        if(!user) {
            req.flash('error', 'Wrong email or password!');
            req.flash('email', email);
            return res.redirect('/login');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            req.flash('error', 'Wrong email or password!');
            req.flash('email', email);
            return res.redirect('/login');
        }
        req.session.isLoggedIn = true;
        req.session.user = user;

        res.redirect(user.isAdmin ? '/admin/orders' : '/');

    } catch (error) {
        req.flash('error', 'Something went wrong!');
        console.log(error)
        return res.redirect('/login');
    }
}

const postLogout = (req, res, next) => {
    req.session.isLoggedIn = false;
    delete req.session.user;

    res.redirect('/login');
}

export {getSignup, getLogin, postSignup, postLogin, postLogout};