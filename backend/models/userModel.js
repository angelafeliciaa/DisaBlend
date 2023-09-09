
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        trim: true,
        required: [true, 'First name is required'],
        maxlength: 32,
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Last name is required'],
        maxlength: 32,
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Email is required'],
        unique: true,
        match:[
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email'
        ]
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Password is required'],
        minlength: [6, 'Password should have at least 6 characters'],
    },
    role: {
        type:Number,
        default:0
    }
}, {timestamps:true})


// encrypting password before saving using bcrypt and async function
// next = go to next function
userSchema.pre('save', async function(next) {
    // if password is not modified
    if (!this.isModified('password')){
        next(); 
    }
    this.password = await bcrypt.hash(this.password, 10);
})

// compare password method 
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// return a JWT Token
userSchema.methods.getJwtToken = function() {
    return jwt.sign({ id: this.id}, process.env.JWT_SECRET,
       {expiresIn: 3600}) // id=payload, pass id of currently logged user, cookie and token expires in 1 hr
}


module.exports = mongoose.model("User", userSchema);