import asyncHandler from 'express-async-handler';
import User from '../Models/users.model.js';
import bcryptjs from 'bcryptjs';


//@desc      Registration funct...
//@route    POST /api/auth/signup
//@access    public
export const signup = asyncHandler(async (req, res, next)=>{
   const {username, email, password} = req.body;
   
    //bcrypting or hiding the password 
   const hashedpassword = bcryptjs.hashSync(password, 10);
   const newUser = new User({username, email, password: hashedpassword});

   try {
       await newUser.save();
       res.status(201).json('user created successfully');
   } catch (error) {
    next(error)
   };

});

