import { IMessage } from '../interfaces';
import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { useAppContext } from '../context';
import { Tooltip, Avatar } from '@chakra-ui/react';

import {
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
} from '../config/ChatLogics';

interface Props {
  messages: IMessage[];
}

const ScrollableChat: React.FC<Props> = ({ messages }) => {
  const { userInfo } = useAppContext();
  return (
    <ScrollableFeed>
      {messages &&
        messages?.map((m, i) => (
          <div key={m._id} className="flex">
            {(isSameSender(messages, m, i, userInfo?._id!) ||
              isLastMessage(messages, i, userInfo?._id!)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  src={m.sender.image}
                  name={m.sender.name}
                  size="sm"
                  cursor="pointer"
                  mr={1}
                  mt="7px"
                />
              </Tooltip>
            )}
            <span
              className={`
            ${m.sender._id === userInfo?._id ? 'bg-blue-300' : 'bg-green-300'}
            rounded-lg
            py-2 px-4
            max-w-3/4
            `}
              style={{
                marginLeft: isSameSenderMargin(messages, m, i, userInfo?.id!),

                marginTop: isSameUser(messages, m, i) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
