const mongoose = require("mongoose");
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "please provide user name!!!"],
        maxlength: 20,
        minlength: 3,
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
    },
});

userSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createJWT = function(){
    const token = jwt.sign({ id: this._id, username: this.username }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    });
    return token
}

userSchema.methods.comparePassword = async function(password){
    const isMatch = await bcrypt.compare(password, this.password)
    return isMatch
}

module.exports = mongoose.model("User", userSchema);
