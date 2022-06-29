import { IUser } from '../interfaces';
import React from 'react';
import { Box, Avatar, Text } from '@chakra-ui/react';

interface Props {
  user: IUser;
  handleFunction: () => void;
}

const UserListItem: React.FC<Props> = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      className="cursor-pointer
  bg-gray-200 hover:bg-blue-400 hover:text-white
  w-full
  flex items-center
  text-black
  p-1 px-2 mb-1 rounded-lg"
    >
      <Avatar
        className="mr-1 cursor-pointer"
        size="sm"
        name={user.name}
        src={user.image}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text className="text-sm">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
