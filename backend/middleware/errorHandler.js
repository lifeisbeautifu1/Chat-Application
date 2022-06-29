import { StatusCodes } from 'http-status-codes'
import { CustomAPIError } from '../errors/index.js';

const errorHandler = async (err, req, res, next) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({message: err.message});
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message})
};

export default errorHandler;