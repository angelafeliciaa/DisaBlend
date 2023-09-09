
// add sign up controller
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse'); 

// controller sign in
// mvc pattern (model, view, contoller)

// exports.signin = (req, res) => {
//     res.send("Hello hi"); 
// }

// SIGN UP CONTROLLER
exports.signup = async (req, res, next) => {
    const  {email} = req.body;
    const userExist = await User.findOne({ email });
    // if user exists in our database, throw email already registered error
    if (userExist){
        return next(new ErrorResponse("Email already registered", 400));
    }
    try {
        const user = await User.create(req.body);
        // because req.body will receive all the fields
        res.status(201).json({
            success: true,
            user
        })
        // send success is true and also send user data
    } catch (error) {
        next(error);
    }
}

// SIGN IN CONTROLLER
exports.signin = async (req, res, next) => {
    
    try {
        const  {email, password} = req.body;
        // if email or password is empty, give email must be added error
        if (!email ){
            return next(new ErrorResponse("Please add an email", 403));
        }
        if (!password ){
            return next(new ErrorResponse("Please add a password", 403));
        }

        // check if user email is registered
        const user = await User.findOne({ email });
        if (!user){
            return next(new ErrorResponse("Invalid credentials - user not found", 403));
        }

        // check if password is correct
        const isMatched = await user.comparePassword(password);
        if (!password){
            return next(new ErrorResponse("Invalid credentials - incorrect password", 403));
        }

        sendTokenResponse(user, 200, res)

    } catch (error) {
        next(error);
    }
}

const sendTokenResponse = async (user, codeStatus, res)=> {
    const token = await user.getJwtToken();
    res
    .status(codeStatus)
    .cookie('token', token, { maxAge: 60*60*1000, httpOnly:true}) // cookie expire in 1 hour, if want for production then https
    .json({success: true, token, user})
}

// user profile (should be authenticated)
exports.userProfile = async (req, res, next) => {

    const user = await User.findById(req.user.id).select('-password');

    res.status(200).json({
        success: true,
        user
    })
    // we sent to frontend the current logged user
}


// log out 
exports.logout = (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Logged out"
    })
}

