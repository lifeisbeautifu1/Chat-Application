import { useAppContext } from '../context';
import { Box } from '@chakra-ui/layout';
import { ChatBox, MyChats, SideDrawer } from '../components';

const Chat = () => {
  const { userInfo } = useAppContext();
  return (
    <div className="w-full">
      {userInfo && <SideDrawer />}
      <Box className="w-full h-[91.5vh] flex justify-between p-3">
        {userInfo && <MyChats />}
        {userInfo && <ChatBox />}
      </Box>
    </div>
  );
};

export default Chat;
