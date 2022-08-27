const isAdmin = (req, res, next) => {
    if(req.session.isLoggedIn && req.session.user.isAdmin) {
        return next();
    }
    if(!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    res.redirect('/');
}

export default isAdmin;