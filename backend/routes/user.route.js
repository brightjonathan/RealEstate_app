import express from 'express';
const authroutertwo = express.Router();
import { updateUser, deleteUser, getUsersListings, getUsers} from '../controllers/user.controllers.js';
import { VerifyUserToken } from '../utils/Verify.user.js';


//auth routes
authroutertwo.post("/update/:id", VerifyUserToken, updateUser);
authroutertwo.delete("/delete/:id", VerifyUserToken, deleteUser);
authroutertwo.get("/listings/:id", VerifyUserToken, getUsersListings);
authroutertwo.get("/:id", VerifyUserToken, getUsers);



export default authroutertwo;

