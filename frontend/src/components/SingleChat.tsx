import { useAppContext } from '../context';
import {
  Box,
  Text,
  IconButton,
  Spinner,
  FormControl,
  Input,
} from '@chakra-ui/react';
import Lottie from 'react-lottie';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IMessage } from '../interfaces';
import { io, Socket } from 'socket.io-client';
import { IChat } from '../interfaces';
import { ServerToClientEvents, ClientToServerEvents } from '../interfaces';
import animationData from '../animations/typing.json';

let socket: Socket<ServerToClientEvents, ClientToServerEvents>,
  selectedChatCompare: IChat | null | undefined;

const SingleChat = () => {
  const {
    userInfo,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    fetchAgain,
    setFetchAgain,
  } = useAppContext();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket = io(process.env.REACT_APP_URL + '');
    socket.emit('setup', userInfo);
    socket.on('connected', () => {
      setSocketConnected(true);
    });

    socket.on('typing', () => setIsTyping(true));

    socket.on('stopTyping', () => setIsTyping(false));
  }, []);

  const typingHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat?._id!);
    }

    let lastTypingTime = new Date().getTime();

    let timerLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit('stopTyping', selectedChat?._id!);
        setTyping(false);
      }
    }, timerLength);
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        process.env.REACT_APP_URL + '/api/message/' + selectedChat?._id,
        config
      );
      // console.log(data);
      setMessages(data);
      setLoading(false);
      // @ts-ignore
      socket.emit('joinChat', selectedChat._id);
    } catch (error) {
      // @ts-ignore
      toast.error(error.response.data);
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && newMessage) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        };
        socket.emit('stopTyping', selectedChat?._id!);

        setNewMessage('');
        const { data } = await axios.post(
          process.env.REACT_APP_URL + '/api/message/',
          {
            content: newMessage,
            chatId: selectedChat?._id,
          },
          config
        );
        // console.log(data);
        if (data) {
          socket.emit('newMessage', data);
          setMessages([...messages, data]);
        }
      } catch (error) {
        // @ts-ignore
        toast.error(error.response.data);
      }
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on('messageReceived', (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification?.includes(newMessageReceived)) {
          if (setNotification && notification) {
            setNotification([newMessageReceived, ...notification]);
          }
          if (setFetchAgain && fetchAgain) setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            className="text-3xl
        pb-3 px-2 w-full flex justify-between
        items-center"
          >
            <IconButton
              aria-label="select chat"
              display={{ base: 'flex', md: 'none' }}
              onClick={() => {
                if (setSelectedChat) setSelectedChat(null);
              }}
              icon={<ArrowBackIcon />}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(userInfo!, selectedChat.users)}
                <ProfileModal
                  userInfo={getSenderFull(userInfo!, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}

                <UpdateGroupChatModal />
              </>
            )}
          </Text>
          <Box
            className="flex flex-col
          justify-end
          p-3
          bg-gray-100
          w-full
          h-full
          rounded-lg
          overflow-y-hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                className="m-auto self-center"
              ></Spinner>
            ) : (
              <div
                className="flex
              flex-col
              overflow-y-scroll
              "
              >
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl isRequired mt={3} onKeyDown={sendMessage}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{
                      marginBottom: 15,
                      marginLeft: 0,
                    }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#e0e0e0"
                placeholder="Enter a message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          className="flex items-center
        justify-center h-full"
        >
          <Text
            className="text-3xl
          pb-3"
          >
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
