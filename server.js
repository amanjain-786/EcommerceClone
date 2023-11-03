// const express = require('express');
import express from "express";//as we are using import here so type ko module karna hoga in package.json bro
import dotenv from 'dotenv';
import morgan from 'morgan';//ye kis url se request aayi hai vo bhi console.mein log karva dega
import connectDB from './config/db.js';
import cors from 'cors'
import colors from 'colors';

//all routes ka import yahan hai bro
import authRoutes from './routes/authRoute.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'

const app = express();


//configure..
//configuring dotenv here
dotenv.config();//as hamara .env root folder mein hi hai bro so no need to give the path bro vo by default defined hai man


//connecting data base here bro database config
connectDB();


//we are still in the development here to port expose ho sakta hai bro but in production ham apna port expose nahi karte
//so things like port mongo ka url , payment ki key we save in the .env file which i have made brp
//for using .env i have to use and extendion .dotenv and also download an npm package for this bro npm i dotenv 
//tabhi ye work karega bro
const port = process.env.PORT || 8080;//means ki agar .env file mein koi dikat hai ya kuch aur ho then by default 8080 port ko consider karo bro

//middle wares bro
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

//routes
//below is the naming convention bro jo ham url mein follow kara hai so zayada soch mat
app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/category', categoryRoutes);

app.use('/api/v1/product', productRoutes);

//rest object


//rest api's

app.get('/', (req, res, next) => {
    res.send('<h1>welcome to ecommerce app</h1>');
});






//run listen to start the app
app.listen(port, () => {
    console.log(`app running at http://localhost:${port} and mode ${process.env.DEV_MODE}`.bgWhite.black);
})


//we are using the mvc architucter i.e saara differenct logic alag folder mein hoga bro
//models alag
//controller alag
//routes alag
//and some more too we can see them bro