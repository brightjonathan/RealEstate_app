import asyncHandler from 'express-async-handler';
import { errorHandler } from './errors.js';
import Jwt from 'jsonwebtoken';

//verifying the authorized user
export const VerifyUserToken = asyncHandler( (req, res, next)=>{
    const token = req.cookies.access_token;

    //verifying if no token
    if (!token) return next(errorHandler(401, 'unauthorized'));

    //verifying the token
    Jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if (err) return next(errorHandler(403, 'Forbidden'));
        req.user = user;
        next();
    });
});

