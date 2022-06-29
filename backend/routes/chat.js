import express from 'express'

const chatRouter = express.Router();
import {
    accessChat,
    fetchChats,
    createGroupChat,
    removeFromGroupChat,
    addToGroupChat,
    renameGroupChat,
} from '../controllers/chat.js'


chatRouter.get('/', fetchChats);
chatRouter.post('/', accessChat);
chatRouter.post('/group', createGroupChat);
chatRouter.patch('/rename', renameGroupChat);
chatRouter.patch('/groupremove', removeFromGroupChat)
chatRouter.patch('/groupadd', addToGroupChat);


export default chatRouter;