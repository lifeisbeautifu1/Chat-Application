import { UnauthorizedError } from "../errors/index.js";
import User from '../models/user.js'
import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer'))
        throw new UnauthorizedError('Provide token');
    const token = req.headers.authorization.split(' ')[1];
    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(id).select('-password');
        next();    
    } catch (error) {
        throw new UnauthorizedError(error.message);
    }
}

export default authMiddleware;