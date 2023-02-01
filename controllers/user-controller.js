const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = "MyKey" 
const nodemailer = require('nodemailer');

const signup = async (req,res, next)=>{
    const {name,email,password} = req.body;
    
    let existingUser;


    try {
        existingUser = await User.findOne({email:email});        
    } catch (error) {
        console.log(error);
    }
    if(existingUser){
        return res.status(400)
        .json({message:"User already exists"})
    }

    const hashedPasword = bcrypt.hashSync(password);
        const user = new User({
         name:name,
         email:email,
         password:hashedPasword
    });
    try {
        await user.save();
    } catch (error) {
        console.log(error);
    }
//-----------------------------------------------------------------//

let mailTransporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"vinity09156@gmail.com",
        pass:"hrikbdylgvmpigud"
    }
})

let details = {
    from: "vinity09156@gmail.com",
    to:user.email,
    subject: "testing",
    text:`http://localhost:3000/users/${user.id}`
}

mailTransporter.sendMail(details,(err)=>{
    if(err){
            console.log("message not send",err);
    }
    else{
        console.log("emailsent");
    }
    // const recievedId = req.body.idNew;
    try{
        console.log("hiiiiiiiiiiii");
    } catch(err){
        console.log("newId not recieved");
    }

})  

    return res.status(201).json({message:user})
}

const verifyEmail = async (req,res,next) =>{
    const id = req.body.id;
    console.log(id);
    User.updateOne({_id:id},{verified:'true'}, (err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("succesfully verified to true");
        }
    })
}






// -----------------------------------------------
const login = async (req,res, next) => {
    const {email,password,} = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({email:email});
        // console.log(existingUser);        
    } catch (err) {
        return new Error(err);
    }
    if(!existingUser){
        return res.status(400)
        .json({message:"User not found Sign Up plz"})
    }
    const isPasswordCorrect = bcrypt.compareSync(password,existingUser.password);
    if(!isPasswordCorrect) {
        return res.status(400).json({message:'invalid Email/password'})
    }

  //------------------------------------------------------------------------//
    if (!existingUser.verified){
        return res.status(400)
        .json({message:"User not verified goto email and verify first"})
    }

    const token = jwt.sign({id:existingUser._id},JWT_SECRET_KEY,{expiresIn:"30s",});

    res.cookie(String(existingUser._id),token,{
        path:"/",
        expires:new Date(Date.now()+ 1000*30),
        httpOnly:true,  
        sameSite:"lax"
    });


    return res.status(200).
    json({message:'succesfully logged in',user:existingUser,token})
};

const  verifyToken = (req,res, next) => {
    const cookies = req.headers.cookie;
    console.log(cookies);
    
    const token = cookies.split("=")[1];
    // console.log(token);
    // console.log(cookies);

    // const headers =req.headers[`authorization`];
    // const token = headers.split(" ")[1];
    if(!token){
        res.status(404).json({message:"No token Found"})
    }
    jwt.verify(String(token), JWT_SECRET_KEY,(err, user)=>{
        if(err){
            res.status(400).json({message:"Invalid token"})
        }
        // console.log(user.id);
        req.id = user.id
    });
    next();
};

const getUser = async (req,res,next) => {
    const userId = req.id;
    let user;
    try {
        user = await User.findById(userId,"-password");
    } catch (err) {
        return new Error(err)
    }
    if(!user) {
        return res.status(404).json({message:"user not found"})
    }
    return res.status(200).json({user})
    //VINIT//
}

exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.verifyEmail = verifyEmail;