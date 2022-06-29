import express from 'express'

const router = express.Router();

import {
    sendMessage,
    getAllMessages
} from '../controllers/message.js'


router.post('/', sendMessage);
router.get("/:chatId", getAllMessages);


export default router;