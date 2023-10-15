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


//@desc      signing with google funct...
//@route    POST /api/auth/google
//@access    public


export const google = asyncHandler(async(req, res, next)=>{
   try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = user._doc;
        res
          .cookie('access_token', token, { httpOnly: true })
          .status(200)
          .json(rest);
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
          username:
            req.body.name.split(' ').join('').toLowerCase() +
            Math.random().toString(36).slice(-4),
          email: req.body.email,
          password: hashedPassword,
          avatar: req.body.photo,
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = newUser._doc;
        res
          .cookie('access_token', token, { httpOnly: true })
          .status(200)
          .json(rest);
      }
    } catch (error) {
      next(error);
    }
});






































// export const google = asyncHandler(async (req, res, next) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ success: false, message: 'Email is required' });
//     }

//     // Try to find a user with the provided email
//     const user = await User.findOne({ email });

//     if (user) {
//       // User with the email exists, authenticate

//       // Create a JSON Web Token (JWT)
//       const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

//       // Create an HTTP-only cookie with the JWT
//       res.cookie('access_token', token, {
//         httpOnly: true,
//         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//       });

//       // Send a 200 (OK) response with user data
//       res.status(200).json({
//         user: {
//           ...user.toObject(),
//           password: undefined, // Exclude password field
//         },
//       });
//     } else {
//       // User with the email does not exist, create a new user

//       // Generate a random password
//       const randomPassword = Math.random().toString(36).slice(2);

//       // Generate a unique username
//       const username = email.split('@')[0] + Math.random().toString(36).substring(7);

//       // Replace this line with logic to set a custom avatar
//       //const customAvatar = req.body.photo;

//       // Create a new user
//       const newUser = new User({
//         email,
//         password: bcryptjs.hashSync(randomPassword, 10), // Securely hash the password 
//         username,
//         avatar: req.body.photo, // Replace with the actual avatar
//       });

//       // Save the new user to the database
//       await newUser.save();

//       // Authenticate the new user

//       // Create a JSON Web Token (JWT)
//       const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

//       // Create an HTTP-only cookie with the JWT
//       res.cookie('access_token', token, {
//         httpOnly: true,
//         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//       });

//       // Send a 200 (OK) response with user data
//       res.status(200).json({
//         user: {
//           ...newUser.toObject(),
//           password: undefined, // Exclude password field
//         },
//       });
//     }
//   } catch (error) {
//     // Handle errors and forward them to the error-handling middleware
//     next(error);
//   }
// });












