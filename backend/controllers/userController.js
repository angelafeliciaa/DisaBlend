
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse'); 

// load all users 
exports.allUsers = async (res, req, next) => {

    // enable pagination
    const pageSize = 10;
    // const page = Number(req.query.pageNumber) || 1; // default is 1 if we dont receive from frontend
    const page = 1;
    // const count = await User.find({}).estimateDocumentCount();
    const count = 2;


    try {
        const users = await User.find().sort({createdAt: -1}).select('-password') // sort by last user created, and retrieve password
        .skip(pageSize * (page-1)) // to enable pagination
        .limit(pageSize)
        
        res.status(200).json({
            success: true,
            users,
            page,
            pages: Math.ceil(count / pageSize),
            count
        })
        next();
    } catch (error) {
        return next(error);
    }
}