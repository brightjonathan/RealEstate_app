import express from "express";
const app = express();
import db from './config/db.js';
import authrouter from "./routes/auth.route.js";
import authroutertwo from "./routes/user.route.js";
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

//connection to database
db();

//local host connection
const port = 4000;
app.listen(port, ()=>{
 console.log(`server is running on port ${port}!!!`);
});

//for all routes end-points
app.use('/api/auth', authrouter);
app.use('/api/user', authroutertwo);

//middleware for handling errors 
app.use((err, req, res, next)=>{
  const statuscode  = err.statuscode || 500;
  const message = err.message || 'internal Server error';
  return res.status(statuscode).json({
    success: false,
    statuscode,
    message,
  });
});






