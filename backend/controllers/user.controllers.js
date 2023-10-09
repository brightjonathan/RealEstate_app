import asyncHandler from 'express-async-handler'; //using asyncHandler dependency... to handle all error in a func...
import User from '../Models/users.model.js';
import { errorHandler } from '../utils/errors.js';
import bcrypt from 'bcryptjs';

//@desc      updating the user funct...
//@route    POST /api/user/update/:id
//@access    public

export const updateUser = asyncHandler(async (req, res, next) => {
    try {
        // Check if the user is allowed to update their account
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
