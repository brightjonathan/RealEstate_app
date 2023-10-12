import express from 'express';
const listingrouter = express.Router();
import {createListing} from '../controllers/listing.controller.js';
import { VerifyUserToken } from '../utils/Verify.user.js';


listingrouter.post('/create', VerifyUserToken, createListing);

export default listingrouter;




