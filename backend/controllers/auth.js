import User from '../models/user.js'
import { BadRequestError, NotFoundError } from '../errors/index.js'
import { StatusCodes } from 'http-status-codes';

export const signUp = async (req, res) => {
    const { name, email, password, image } = req.body;
    if (!name || !email || !password) {
        throw new BadRequestError('Please provide all fields!');
    }
    let user = await User.findOne({email})
    if (user) {
        throw new BadRequestError('User already exist!');
    }
    user = await User.create(req.body);
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
        token,
        name: user.name,
        id: user._id,
        email: user.email,
        image: user.image,
        _id: user._id,
    });
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new BadRequestError('Please provide all fields!');
    const user = await User.findOne({email});
    if (!user) {
        throw new NotFoundError('User doesnt exist');
    }
    const isMatch = await user.comparePasswords(password);
    if (!isMatch) {
       throw new BadRequestError('Password do not match!');
    } else {
        const token = user.createJWT();
        res.status(StatusCodes.OK).json({
          token,
          name: user.name,
          id: user._id,
          email: user.email,
          image: user.image,
          _id: user._id,
        });
    }
}