import asyncHandler from 'express-async-handler';
import User from '../Models/users.model.js';
import bcryptjs from 'bcryptjs';
import  {errorHandler} from '../utils/errors.js';
import jwt from 'jsonwebtoken';

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

//@desc      login funct...
//@route    POST /api/auth/signin
//@access    public
export const signin = asyncHandler(async (req, res, next)=>{
    const {email, password} = req.body;
     try {
        const validuser = await User.findOne({email});
       if(!validuser) return next(errorHandler(404, 'wrong credential!'));
       const validPassword = bcryptjs.compareSync(password, validuser.password);
       if(!validPassword) return next(errorHandler(401, 'wrong credential!'));
       const token = jwt.sign({id: validuser._id}, process.env.JWT_SECRET);

       //hiding the password 
        const {password: pass, ...rest } = validuser._doc;     

        res.cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest)
     } catch (error) {
        next(error)
     }
});


//@desc      logout funct...
//@route    GET /api/auth/signout
//@access    public
export const signout = asyncHandler(async(req, res, next)=>{
   try {
      res.clearCookie('access_token');
      res.status(200).json('user has been logged out')
   } catch (error) {
      next(error);
   }
});