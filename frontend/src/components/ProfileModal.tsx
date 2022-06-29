import { useDisclosure } from '@chakra-ui/hooks';
import { IUser } from '../interfaces';
import {
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Image,
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';

interface Props {
  children?: React.ReactNode;
  userInfo: IUser;
}
const ProfileModal = ({ userInfo, children }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          aria-label="Open Profile"
          className="flex"
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader className="text-4xl flex justify-center">
            {userInfo.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col items-center justify-between">
            <Image
              className="rounded-full h-40 w-40"
              src={userInfo.image}
              alt={userInfo.name}
            />
            <Text className="text-3xl">Email: {userInfo.email}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
