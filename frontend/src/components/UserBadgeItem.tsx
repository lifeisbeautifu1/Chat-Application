import { IUser } from '../interfaces';
import { Box } from '@chakra-ui/react';
import React from 'react';
import { CloseIcon } from '@chakra-ui/icons';

interface Props {
  user: IUser;
  handleFunction: () => void;
}

const UserBadgeItem: React.FC<Props> = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      className="p-2 rounded-lg m-1 mb-2 text-xs cursor-pointer bg-purple-500 text-white"
    >
      {user.name}
      <CloseIcon className="pl-1" />
    </Box>
  );
};

export default UserBadgeItem;
