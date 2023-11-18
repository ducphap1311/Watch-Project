const Order = require('../model/Order')

const getOrders = async (req, res) => {
    const createdBy = req.user.id;
    const orders = await Order.find({createdBy})
    res.status(200).json({ orders });
};

const getAllOrders = async (req, res) => {
    const orders = await Order.find({})
    res.status(200).json({orders})
}

const createOrder = async (req, res) => {
    req.body.createdBy = req.user.id;
    const order = await Order.create(req.body)
    res.status(200).json({order});
};

module.exports = { getOrders, getAllOrders, createOrder };
