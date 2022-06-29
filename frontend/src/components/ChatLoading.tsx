import { Stack, Skeleton } from '@chakra-ui/react';

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height="30px"></Skeleton>
      <Skeleton height="30px"></Skeleton>
      <Skeleton height="30px"></Skeleton>
      <Skeleton height="30px"></Skeleton>
      <Skeleton height="30px"></Skeleton>
      <Skeleton height="30px"></Skeleton>
      <Skeleton height="30px"></Skeleton>
      <Skeleton height="30px"></Skeleton>
    </Stack>
  );
};

export default ChatLoading;
