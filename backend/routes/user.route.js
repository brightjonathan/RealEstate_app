import express from 'express';
const authroutertwo = express.Router();
import { updateUser, deleteUser } from '../controllers/user.controllers.js';
import { VerifyUserToken } from '../utils/Verify.user.js';


//auth routes
authroutertwo.post("/update/:id", VerifyUserToken, updateUser);
authroutertwo.delete("/delete/:id", VerifyUserToken, deleteUser);


export default authroutertwo;

