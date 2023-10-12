import asyncHandler from 'express-async-handler';
import Listing from '../Models/listing.model.js';


//@desc      create funct...
//@route    POST /api/listing/create
//@access    public
export const createListing = asyncHandler(async(req, res, next)=>{
   try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
   } catch (error) {
    next(error); 
   }
});