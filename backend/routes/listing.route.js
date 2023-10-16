import express from 'express';
const listingrouter = express.Router();
import {createListing, deleteUserListings} from '../controllers/listing.controller.js';
import { VerifyUserToken } from '../utils/Verify.user.js';


listingrouter.post('/create', VerifyUserToken, createListing);
listingrouter.delete("/deleteUser/:id", VerifyUserToken, deleteUserListings);

export default listingrouter;




