import { useDisclosure } from '@chakra-ui/hooks';
import { IUser } from '../interfaces';
import {
  FormControl,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
} from '@chakra-ui/react';
import UserListItem from './UserListItem';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAppContext } from '../context';
import axios from 'axios';
import UserBadgeItem from './UserBadgeItem';

interface Props {
  children?: React.ReactNode;
}
const GroupChatModal = ({ children }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { userInfo, chats, setChats } = useAppContext();

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
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.warning('Please fill all the fields!');
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
      const { data } = await axios.post(
        process.env.REACT_APP_URL + '/api/chat/group',
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      console.log(data);
      if (chats && setChats) {
        setChats([data, ...chats]);
      }
      onClose();
      toast.success('New Group Chat Created!');

      setLoading(false);
    } catch (error) {
      // @ts-ignore
      toast.error(error.response.data);
      setLoading(false);
    }
  };
  const handleGroup = (userToAdd: IUser) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.warning('User already added');
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (userToDelete: IUser) => {
    setSelectedUsers(
      selectedUsers.filter((user) => {
        return user._id !== userToDelete._id;
      })
    );
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-3xl flex justify-center">
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col items-center">
            <FormControl>
              <Input
                placeholder="Chat name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Jane, Piyush"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box className="w-full flex flex-wrap">
              {selectedUsers?.map((user) => {
                return (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleDelete(user)}
                  />
                );
              })}
            </Box>
            {loading ? (
              <div>loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
