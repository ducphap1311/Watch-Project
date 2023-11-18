const express = require('express')
const router = express.Router()
const {getOrders, createOrder, getAllOrders} = require('../controllers/Order')
const authenticateUser = require('../middlewares/auth')

router.route('/orders').get(authenticateUser, getOrders)
router.route('/orders').post(authenticateUser, createOrder)
router.route('/allorders').get(getAllOrders)

module.exports = router