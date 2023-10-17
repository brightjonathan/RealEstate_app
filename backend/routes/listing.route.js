import express from 'express';
const listingrouter = express.Router();
import {createListing, deleteUserListings, updateUserListings, getUserListings} from '../controllers/listing.controller.js';
import { VerifyUserToken } from '../utils/Verify.user.js';


listingrouter.post('/create', VerifyUserToken, createListing);
listingrouter.delete("/deleteUser/:id", VerifyUserToken, deleteUserListings);
listingrouter.post('/updateUser/:id', VerifyUserToken, updateUserListings);
listingrouter.get('/getUserlisting/:id', getUserListings);

export default listingrouter;


