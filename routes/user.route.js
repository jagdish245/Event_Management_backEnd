const express = require("express");
const {register, login, displayUsers, logout, me} = require("../controllers/user.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");


const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.get('/getusers',displayUsers)
router.post('/logout', verifyJWT,logout)
router.post('/me', verifyJWT,me)

module.exports = router;