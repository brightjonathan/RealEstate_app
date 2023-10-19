import express from "express";
import db from './config/db.js';
import authrouter from "./routes/auth.route.js";
import authroutertwo from "./routes/user.route.js";
import listingrouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from 'path';
import bodyParser from "body-parser";

//connection to database
db();


const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors())

// Add body-parser middleware with a higher limit (e.g., 10MB)
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));



//local host connection
const port = 4000;
app.listen(port, ()=>{
 console.log(`server is running on port ${port}!!!`);
});

//for all routes end-points
app.use('/api/auth', authrouter);
app.use('/api/user', authroutertwo);
app.use('/api/listing', listingrouter);


//
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

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






