import express from 'express';
const authrouter = express.Router();
import { signup, signin } from '../controllers/auth.controller.js';

//auth routes
authrouter.post("/signup", signup);
authrouter.post("/signin", signin);

export default authrouter;

