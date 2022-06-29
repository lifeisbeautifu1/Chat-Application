import { StatusCodes } from "http-status-codes";
import User from '../models/user.js'

export const getAllUsers = async (req, res) => {
   const keyword = req.query.search
     ? {
         $or: [
           { name: { $regex: req.query.search, $options: 'i' } },
           { email: { $regex: req.query.search, $options: 'i' } },
         ],
       }
     : {};

   const users = await User.find(keyword).find({ _id: { $ne: req.user.id } });
   res.status(StatusCodes.OK).json(users);
};

