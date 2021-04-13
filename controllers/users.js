const User = require('../models/user');

module.exports.registerForm = (req, res) => {
    res.render('user/register');
}

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({email , username});
        const registerdUser = await User.register(user, password);
        req.login(registerdUser, err => {
            if(err) return next(err);
            req.flash('success', 'welcome to YelpCamp');
        res.redirect('/campsites');
        })
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.loginForm = (req, res) => {
    res.render('user/login');
}

module.exports.secureLogin = (req,res) => {
    req.flash('success', 'Welcome Back!')
       const redirectUrl = req.session.returnTo || '/campsites';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Logout Successful");
    res.redirect('/campsites');
}