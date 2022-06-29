import { useAppContext } from '../context';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatBox = () => {
  const { selectedChat } = useAppContext();
  return (
    <Box
      className={`md:flex
    items-center
    flex-col
    p-3
    bg-white
    rounded-lg
    border
    w-full
    md:w-[68%] ${selectedChat ? 'flex' : 'hidden'}`}
    >
      <SingleChat />
    </Box>
  );
};

export default ChatBox;
