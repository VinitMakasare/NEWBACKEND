const express = require('express');
const { signup,login, verifyToken, getUser,verifyEmail } = require('../controllers/user-controller');

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.get("/user", verifyToken,getUser)
router.post("/verifyemail", verifyEmail)


module.exports=router;

