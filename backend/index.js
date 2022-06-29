import express from 'express';
import express_async_errors from 'express-async-errors'
import 'dotenv/config';
import connectDB from './db/connect.js'
import { Server } from 'socket.io';
import cors from 'cors'
import helmet from 'helmet'
import xss from 'xss-clean'
import colors from 'colors'

import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js'
import auth from './middleware/auth.js'
import authRouter from './routes/auth.js'
import chatRouter from './routes/chat.js'
import messageRouter from './routes/message.js'
import usersRouter from './routes/users.js'

const app = express();


const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(xss());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('API is running...');
})

app.use('/api/auth', authRouter);
app.use('/api/chat', auth, chatRouter);
app.use('/api/users', auth, usersRouter)
app.use('/api/message', auth, messageRouter)


app.use(notFound);
app.use(errorHandler);

let server;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server = app.listen(PORT, () => {
      console.log(`App running on port ${PORT}`.yellow.bold);
    });
  } catch (error) {
    console.log(`${error}`.red.bold);
  }
}

await start();
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

io.on('connection', (socket) => {

    socket.on('setup', (userData) => {
      socket.join(userData._id);
      socket.emit('connected');
    });

    socket.on('joinChat', (room) => {
      socket.join(room);
      console.log('User joined room ' + room);
    })

    socket.on('newMessage', (newMessageReceived) => {
      const chat = newMessageReceived.chat;

      if (!chat.users)
        return;

        chat.users.forEach(user => {

          if (user._id === newMessageReceived.sender._id)
          return;

          socket.in(user._id).emit('messageReceived', newMessageReceived);
        })
    })

    socket.on('typing', (room) => {
      socket.in(room).emit('typing');
    })

    socket.on('stopTyping', (room) => {
      socket.in(room).emit('stopTyping');
    })

    socket.off('setup', () => {
      console.log('USER DISCONNECTED');
      socket.leave(userData._id);
    });
})

