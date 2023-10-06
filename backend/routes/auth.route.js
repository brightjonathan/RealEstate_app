import express from 'express';
const authrouter = express.Router();
import { signup } from '../controllers/auth.controller.js';

//signup routes
authrouter.post("/signup", signup);


export default authrouter;

