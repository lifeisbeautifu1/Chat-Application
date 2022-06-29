import {
    BadRequestError
} from '../errors/index.js'
import Message from '../models/message.js'
import User from '../models/user.js'
import Chat from '../models/chat.js'
import { StatusCodes } from 'http-status-codes'

export const sendMessage = async (req, res) => {
    const {
        content,
        chatId
    } = req.body;

    if (!content || !chatId) {
        throw new BadRequestError('Invalid data passsed into request');
    }

    const newMessage = {
        sender: req.user._id,
        content,
        chat: chatId,
    }

    let message = await Message.create(newMessage);

    message = await message.populate('sender', 'name image');

    message = await message.populate('chat');

    message = await User.populate(message, {
        path: 'chat.users',
        select: 'name image email',
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessage: message,
    });

    res.status(StatusCodes.OK).json(message);  
}

export const getAllMessages = async (req, res) => {
    const messages = await Message.find({
        chat: req.params.chatId
    }).populate('sender', 'name image email').populate('chat');

    res.status(StatusCodes.OK).json(messages);

}