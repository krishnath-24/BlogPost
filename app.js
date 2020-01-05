// require all the modules
const express =require('./node_modules/express');
const bodyParser=require('./node_modules/body-parser');
const mongoose = require('mongoose');



//create the express app
const app=express();

// tell the app to use body parser
app.use(bodyParser.urlencoded({extended:true}));


