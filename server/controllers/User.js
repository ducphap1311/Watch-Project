const { BadRequestError, NotFoundError, UnauthenticatedError } = require("../errors");
const User = require("../model/User");

const register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        throw new BadRequestError('Please provide necessary informations')
    }
    const user = await User.create(req.body);
    const token = user.createJWT();
    res.status(200).json({
        msg: "user created",
        token,
        username: user.username,
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('Please provide necessary informations')
    }
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new UnauthenticatedError('Invalid email')
    }
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        throw new UnauthenticatedError('Invalid password')
    }
    const token = user.createJWT();
    res.status(200).json({ msg: "user found", token, username: user.username });
};

const dashboard = async (req, res) => {
    res.status(200).json({ msg: "success" });
};

const getUsers = async(req, res) => {
    const users = await User.find({})
    res.status(200).json({users})
}
module.exports = { register, login, dashboard, getUsers };
