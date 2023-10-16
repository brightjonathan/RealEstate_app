import asyncHandler from 'express-async-handler';
import Listing from '../Models/listing.model.js';
import { errorHandler } from '../utils/errors.js';


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



//@desc      deleting the user listings funct...
//@route     DELETE /api/listing/deleteUser/:id 
//@access    public
export const deleteUserListings = asyncHandler(async (req, res, next)=>{
   const listing = await Listing.findById(req.params.id);

   if (!listing) {
    return next(errorHandler(403, 'Listing not found'));
   };

   // Check if the user(from verify.user.js) is allowed to update their account
   if (req.user.id !== listing.userRef) {
    return next(errorHandler(403, 'You can only delete a list on your own account!')); 
   };


   try {
      await Listing.findByIdAndDelete(req.params.id);
      res.status(200).json('Listing has been deleted successfully')
   } catch(error) {
     next(error)
   };
});
