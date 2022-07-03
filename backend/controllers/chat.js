import User from '../models/user.js'
import Chat from '../models/chat.js'
import { BadRequestError, NotFoundError } from '../errors/index.js'
import {StatusCodes} from 'http-status-codes';

export const accessChat = async (req, res) => {
    const { userId } = req.body;
    if (!userId)
        throw new BadRequestError('userId params not sent with request!')
    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {
                users: {
                    $elemMatch: {
                        $eq: req.user.id
                    }
                }
            },
            {
                users: {
                    $elemMatch: {
                        $eq: userId
                    }
                }
            }
        ]
    }).populate('users', '-password')
    .populate('latestMessage');

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'name image email',
    })

    if (isChat.length > 0) {
        res.json(isChat[0]);
    } else {
        const chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users: [req.user._id, userId],
        }
        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({
                _id: createdChat._id
            }).populate('users', '-password');
            res.status(StatusCodes.OK).json(fullChat);
        } catch (error) {
            throw new BadRequestError(error.message);
        }
    }
}

export const fetchChats = async (req, res) => {
    try {
        const chat = await Chat.find({
            users: {
                $elemMatch: {
                    $eq: req.user.id
                }
            }
        }).populate('users', '-password')
        .populate('groupAdmin','-password')
        .populate('latestMessage')
        .sort({updatedAt: -1});
        const result = await User.populate(chat, {
            path: 'latestMessage.sender',
            select: 'name image email',
        })
        res.status(StatusCodes.OK).json(result);

    } catch (error) {
        throw new BadRequestError(error.message);
    }
}

export const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        throw new BadRequestError('Please fill all the fields!');
    }
 
    const users = JSON.parse(req.body.users);


    if (users.length < 2) {
        throw new BadRequestError('More than 2 users required to form a group chat');
    }

    users.push(req.user);


    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });
        const fullGroupChat = await Chat.findOne({
            _id: groupChat._id,
        })
        .populate('users', '-password')
        .populate('groupAdmin', '-password');

        res.status(StatusCodes.OK).json(fullGroupChat)
    } catch (error) {
        throw new BadRequestError(error.message);
    }
}

export const removeFromGroupChat = async (req, res) => {
   const {
    chatId,
    userId
   } = req.body;

   const removed = await Chat.findByIdAndUpdate(chatId, {
    $pull: {
        users: userId
    }
   }, {
    new: true,
   }).populate('users', '-password')
   .populate('groupAdmin', '-password');

   if (!removed) {
    throw new NotFoundError('Chat not found!');
   } else {
    res.status(StatusCodes.OK).json(removed);
   }
}

export const addToGroupChat = async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: {
          users: userId,
        },
      },
      {
        new: true,
      }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!added) {
      throw new NotFoundError('Chat not found!');
    } else {
      res.status(StatusCodes.OK).json(added);
    }
}

export const renameGroupChat = async (req, res) => {
     const { chatId, chatName } = req.body;

     const updatedChat = await Chat.findByIdAndUpdate(
       chatId,
       {
         chatName,
       },
       {
         new: true,
       }
     )
       .populate('users', '-password')
       .populate('groupAdmin', '-password');

     if (!updatedChat) {
       throw new NotFoundError('Chat not found');
     } else {
       res.status(StatusCodes.OK).json(updatedChat);
     }
}
