import {
  Tooltip,
  Menu,
  Button,
  MenuButton,
  MenuDivider,
  MenuList,
  MenuItem,
  Avatar,
  Drawer,
  DrawerOverlay,
  DrawerBody,
  DrawerHeader,
  Input,
  Box,
  Text,
  DrawerContent,
  Spinner,
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { IUser } from '../interfaces';
import { useAppContext } from '../context';
import { useNavigate } from 'react-router-dom';
import { ChatLoading, ProfileModal, UserListItem } from './index';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getSender } from '../config/ChatLogics';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const {
    userInfo,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = useAppContext();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const accessChat = async (userId: string) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
      const { data } = await axios.post(
        process.env.REACT_APP_URL + '/api/chat',
        {
          userId,
        },
        config
      );

      if (!chats?.find((c) => c._id === data._id)) {
        //@ts-ignore
        setChats([data, ...chats]);
      }

      //@ts-ignore
      setSelectedChat(data);

      onClose();
      setLoadingChat(false);
    } catch (error) {
      // @ts-ignore
      toast.error(error.response.data);
      setLoadingChat(false);
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toast.warning('Please enter something in search', {
        position: 'top-left',
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
      const { data } = await axios.get(
        process.env.REACT_APP_URL + '/api/users?search=' + search,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      //@ts-ignore
      toast.error(error.response.data);
      setLoading(false);
    }
  };
  return (
    <>
      <Box className="bg-white flex justify-between items-center w-full py-2 px-3 border-4">
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Text className="px-1 md:flex hidden">Search User</Text>
          </Button>
        </Tooltip>
        <Text className="text-2xl">Talk-A-Tive</Text>
        <div>
          <Menu>
            <MenuButton className="p-1">
              <NotificationBadge
                count={notification?.length}
                effect={Effect.SCALE}
              />
              <BellIcon className="text-2xl m-1" />
            </MenuButton>
            <MenuList pl={3}>
              {!notification?.length && 'No New Messages'}
              {notification?.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    if (setSelectedChat) setSelectedChat(notif.chat);
                    if (setNotification)
                      setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `
                    New Message form ${getSender(userInfo!, notif.chat.users)}
                    `}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={userInfo?.name}
                src={userInfo?.image}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal userInfo={userInfo!}>
                <MenuItem>Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box className="flex pb-1">
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              <>
                {!searchResult?.length && (
                  <Text className="font-bold mt-4">Not Found</Text>
                )}
                {searchResult?.map((user, index) => {
                  return (
                    <UserListItem
                      key={index}
                      user={user}
                      handleFunction={() => accessChat(user._id!)}
                    />
                  );
                })}
              </>
            )}
            {loadingChat && <Spinner ml="auto" className="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
