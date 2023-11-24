const express = require('express')
const router = express.Router()
const {register, login,dashboard, getUsers} = require('../controllers/User')
const authenticateUser = require('../middlewares/auth')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/allusers').get(getUsers)
router.route('/dashboard').get(authenticateUser, dashboard)
module.exports = router