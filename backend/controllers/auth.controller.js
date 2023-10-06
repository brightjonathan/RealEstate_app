import asyncHandler from 'express-async-handler';

export const signup = asyncHandler(async (req, res)=>{
   console.log(req.body);
});




