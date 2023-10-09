import express from 'express';
const authroutertwo = express.Router();
import { updateUser } from '../controllers/user.controllers.js';
import { VerifyUserToken } from '../utils/Verify.user.js';


//auth routes
authroutertwo.post("/update/:id", VerifyUserToken, updateUser);


export default authroutertwo;

