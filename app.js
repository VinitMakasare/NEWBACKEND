const express = require('express');
const mongoose = require('mongoose');
const router = require("./routes/user-routes");
const cookieParser = require('cookie-parser')
const cors = require ('cors');
require('dotenv').config();
const PORT = process.env.PORT || 5000


const app = express();
app.use(cors({credentials:true,origin:"http://localhost:3000"}));
app.use(cookieParser());
app.use(express.json());

app.use('/api',router);

mongoose.connect("mongodb+srv://vinitmakasare:8626013216v@cluster0.em2hnko.mongodb.net/auth?retryWrites=true&w=majority").then(()=>{
    app.listen(PORT);
    console.log(`database connected on ${PORT}`);
   
}).catch((err)=>console.log(err));

