import { useAppContext } from '../context';
import {
  Button,
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  FormControl,
  Input,
  Spinner,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import { IUser } from '../interfaces';
import { toast } from 'react-toastify';
import UserBadgeItem from './UserBadgeItem';
import axios from 'axios';
import UserListItem from './UserListItem';

const UpdateGroupChatModal = () => {
  const { fetchAgain, setFetchAgain, selectedChat, setSelectedChat, userInfo } =
    useAppContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<IUser[]>([]);
  const handleRemove = async (user: IUser) => {
    if (
      selectedChat?.groupAdmin._id !== userInfo?.id &&
      user._id !== userInfo?.id
    ) {
      toast.error('Only admins can remove someone');
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
      const { data } = await axios.patch(
        process.env.REACT_APP_URL + `/api/chat/groupremove`,
        {
          chatId: selectedChat?._id,
          userId: user._id,
        },
        config
      );
      console.log(data);
      console.log(user._id, userInfo?.id);
      if (data && setSelectedChat)
        user._id === userInfo?.id
          ? setSelectedChat(null)
          : setSelectedChat(data);

      if (setFetchAgain) setFetchAgain(!fetchAgain);

      setLoading(false);
    } catch (error) {
      // @ts-ignore
      toast.error(error.response.data);
      setLoading(false);
    }
  };
  const handleAddUser = async (user: IUser) => {
    if (selectedChat?.users.find((u) => u._id === user._id)) {
      toast.warning('User Already in group!');
      return;
    }
    if (selectedChat?.groupAdmin._id !== userInfo?.id) {
      toast.warning('Only Admins can add users to chat');
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
      const { data } = await axios.patch(
        process.env.REACT_APP_URL + `/api/chat/groupadd`,
        {
          chatId: selectedChat?._id,
          userId: user._id,
        },
        config
      );
      if (data && setSelectedChat) setSelectedChat(data);
      if (setFetchAgain) setFetchAgain(!fetchAgain);

      setLoading(false);
    } catch (error) {
      // @ts-ignore
      toast.error(error.response.data);
      setLoading(false);
    }
  };
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
      const { data } = await axios.patch(
        process.env.REACT_APP_URL + '/api/chat/rename',
        {
          chatId: selectedChat?._id,
          chatName: groupChatName,
        },
        config
      );
      if (data && setSelectedChat) {
        setSelectedChat(data);
      }
      if (setFetchAgain) setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error: any) {
      toast.error(error.response.data);
      setRenameLoading(false);
      setGroupChatName('');
    }
  };
  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query) {
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
        process.env.REACT_APP_URL + `/api/users?search=${search}`,
        config
      );
      console.log(data);
      setSearchResult(data);

      setLoading(false);
    } catch (error) {
      //   @ts-ignore
      toast.error(error.response.data);
      setLoading(false);
    }
  };
  return (
    <>
      <IconButton
        aria-label="view"
        className="flex"
        icon={<ViewIcon />}
        onClick={onOpen}
      />
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="flex justify-center items-center">
            {selectedChat?.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              className="
            w-full
            flex
            flex-wrap
            pb-3"
            >
              {selectedChat?.users.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleRemove(user)}
                />
              ))}
            </Box>
            <FormControl className="flex">
              <Input
                placeholder="Chat Name"
                className="mb-3"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              //   @ts-ignore
              onClick={() =>
                handleRemove({
                  ...userInfo!,
                  _id: userInfo?.id,
                })
              }
              mr={3}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
