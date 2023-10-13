import express from 'express';
const authrouter = express.Router();
import { signup, signin, signout, google } from '../controllers/auth.controller.js';

//auth routes
authrouter.post("/signup", signup);
authrouter.post("/signin", signin);
authrouter.post('/google', google);
authrouter.get("/signout", signout);

export default authrouter;


