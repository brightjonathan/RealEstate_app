import express from "express";
const app = express();
import db from './config/db.js';
import authrouter from "./routes/auth.route.js";

app.use(express.json());
app.use(express.urlencoded({extended: false}));

//connection to database
db();

//local host connection
const port = 4000;
app.listen(port, ()=>{
 console.log(`server is running on port ${port}!!!`);
});

//for all routes end-points
app.use('/api/auth', authrouter);

