
const ErrorResponse = require('../utils/errorResponse'); 
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// check if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
    const {token} = req.cookies;
    // extract token, make sure that token exists

    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id); // since our payload has id, find id of current logged user
        next();
    }
    catch (error) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
}

// middleware for admin (authorization)
exports.isAdmin = (req, res, next) => {
    if (req.user.role === 0) {
        return next(new ErrorResponse('Access denied, must be an admin', 401));
    }
    next();
}
