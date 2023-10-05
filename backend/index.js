import express from "express";
const app = express();
import db from './config/db.js'



//connection to database
db();

//local host connection
const port = 4000;
app.listen(port, ()=>{
 console.log(`server is running on port ${port}!!!`);
});