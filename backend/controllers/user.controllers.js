import asyncHandler from 'express-async-handler'; //using asyncHandler dependency... to handle all error in a func...
import User from '../Models/users.model.js';  //user model
import Listing from '../Models/listing.model.js';  //listing model
import { errorHandler } from '../utils/errors.js';
import bcrypt from 'bcryptjs';


//@desc      updating the user funct...
//@route    POST /api/user/update/:id
//@access    public

export const updateUser = asyncHandler(async (req, res, next) => {
    try {
        // Check if the user(from verify.user.js) is allowed to update their account
        if (req.user.id !== req.params.id) {
            return next(errorHandler(403, 'You can only update your own account!'));
        }

        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }

        // Update the user and get the updated user data
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true });

        if (!updatedUser) {
            return next(errorHandler(404, 'User not found')); // Handle the case where the user doesn't exist
        }

        // Separate the password from the rest
        const { password, ...rest } = updatedUser._doc; // Use _doc to access document properties

        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
});


//@desc      deleting the user funct...
//@route     DELETE /api/user/delete/:id
//@access    public
export const deleteUser = asyncHandler( async (req, res, next)=>{

    // Check if the user(from verify.user.js) is allowed to update their account
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await User.findByIdAndDelete(req.params.id)
    res.clearCookie('access_token');
    res.status(200).json('user has been deleted');
  } catch (error) {
    next(error)
  }  
});



//@desc      getting the user listings funct...
//@route     GET /api/user/listings/:id
//@access    public
export const getUsersListings = asyncHandler(async (req, res, next) => {
    // Validate if the user ID is equal to the parameter ID
    if (req.user.id === req.params.id) {
      try {
        const listings = await Listing.find({ userRef: req.params.id });  ////finding the user who posted it using there id
        res.status(200).json(listings); // Send the retrieved listings in the response
      } catch (error) {
        // Handle database query errors
        next(error);
      }
    } else {
        return next(errorHandler(401, 'you can only view your own listing'));
    }
  });



 //@desc      getting the user funct...
 //@route     GET /api/user/:id
 //@access    public
  export const getUsers = asyncHandler(async (req, res, next)=>{

    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(404, errorHandler('User not found!'));
      }

      const { password, ...rest } = user._doc;
      res.status(200).json(rest);
      } catch (error) {
        next(error)
      }
      
  });

