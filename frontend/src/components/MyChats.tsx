import { useAppContext } from '../context';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { IUser } from '../interfaces';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './GroupChatModal';
const MyChats = () => {
  const {
    selectedChat,
    setSelectedChat,
    userInfo,
    chats,
    setChats,
    fetchAgain,
  } = useAppContext();
  const [loggedUser, setLoggedUser] = useState<IUser>(userInfo!);
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
      const { data } = await axios.get(
        process.env.REACT_APP_URL + '/api/chat',
        config
      );
      // @ts-ignore
      setChats(data);
    } catch (error) {
      // @ts-ignore
      toast.error(error.response.data);
    }
  };
  useEffect(() => {
    const user = localStorage.getItem('userInfo');
    if (user) {
      setLoggedUser(JSON.parse(user));
    }
    fetchChats();
  }, [fetchAgain]);
  return (
    <Box
      className={`border rounded-lg w-full md:w-[30%] bg-white
  items-center
  flex-col
  p-2
  md:flex
  ${selectedChat ? 'hidden' : 'flex'}`}
    >
      <Box
        className="
      pb-2 px-2 text-2xl flex w-full justify-between items-center"
      >
        My Chats
        <GroupChatModal>
          <Button className="flex text-lg" rightIcon={<AddIcon />}>
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        className="flex flex-col p-2 bg-gray-100
        w-full h-full rounded-lg overflow-y-hidden"
      >
        {chats ? (
          <Stack>
            {chats.map((chat) => (
              <Box
                // @ts-ignore
                onClick={() => setSelectedChat(chat)}
                key={chat._id}
                bg={selectedChat === chat ? '#38b2ac' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                className="cursor-pointer p-2 px-4 rounded-lg"
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser!, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
