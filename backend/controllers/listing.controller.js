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



//@desc      updating the user listings funct...
//@route     post /api/listing/updateUser/:id  
//@access    public
export const updateUserListings = asyncHandler(async(req, res, next)=>{
   const listing = await Listing.findById(req.params.id);

   if (!listing) {
    return next(errorHandler(403, 'Listing not found'));
   };

   // Check if the user(from verify.user.js) is allowed to update their account
   if (req.user.id !== listing.userRef) {
      return next(errorHandler(403, 'You can only update a list on your own account!')); 
   };

   try {
      const updatedListing = await Listing.findByIdAndUpdate(
         req.params.id,
         req.body,
         {new: true}     //getting the new updated listing. if you don't add this you will still get the previous one.   
      );
      res.status(200).json(updatedListing);
   } catch (error) {
      next(error)
   }


});



//@desc      GETTING the user listings funct...
//@route     GET /api/listing/getUserlisting/:id  
//@access    public
export const getUserListings = asyncHandler(async (req, res, next)=>{
      try {
         const listing = await Listing.findById(req.params.id);
         if (!listing) return next(errorHandler(401, 'listing not found'));
         res.status(200).json(listing);
      } catch (error) {
         next(error)
      }
});


//@desc      searching the listings funct...
//@route     GET /api/listing/search
//@access    public
export const searchListings = asyncHandler(async (req, res, next)=>{
    try {
      const limit = parseInt(req.query.limit) || 9; //making it to start from 0-9 listings
      const startIndex = parseInt(req.query.startindex) || 0; //making it to start from 0

      //making a query for the checkBox : if undefined or false it should query it

      let offer = req.query.offer;

      if (offer === undefined || offer === 'false') {
         offer = { $in: [false, true]}
      };

      let furnished = req.query.furnished;

      if (furnished === undefined || furnished === 'false') {
        furnished = { $in: [false, true] };
      };

      let parking = req.query.parking;

      if (parking === undefined || parking === 'false') {
        parking = { $in: [false, true] };
      };


      let type = req.query.type;

      if (type === undefined || type === 'all') {
        type = { $in: ['sale', 'rent'] };
      };

      const searchTerm = req.query.searchTerm || ''; 
      const sort = req.query.sort || 'createdAt';
      const order = req.query.order || 'desc';

      const listings = await Listing.find({
         title: { $regex: searchTerm, $options: 'i' },
         offer,
         furnished,
         parking,
         type,
       })
         .sort({ [sort]: order })
         .limit(limit)
         .skip(startIndex);
   
       if (!listings) return next(errorHandler(401, 'No listings found'));
       // Handle the case where no listings were found, e.g., send a 404 response.      
   
       // Send the listings as a JSON response
       return res.status(200).json(listings);
  

    } catch (error) {
      next(error);
    };
});









