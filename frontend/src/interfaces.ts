import React from 'react';

export interface IUser {
  name: string;
  email: string;
  id: string;
  image: string;
  token: string;
  _id?: string;
}

export interface IChat {
  isGroupChat: boolean;
  users: IUser[];
  _id: string;
  chatName: string;
  groupAdmin: IUser;
}

export interface IMessage {
  chat: IChat;
  content: string;
  sender: IUser;
  _id: string;
  readBy?: IUser[];
  createdAt?: string;
}

export interface ServerToClientEvents {
  connected: () => void;
  messageReceived: (newMessage: IMessage) => void;
  typing: (room: string) => void;
  stopTyping: (room: string) => void;
}

export interface ClientToServerEvents {
  setup: (userData: IUser | null | undefined) => void;
  joinChat: (room: string) => void;
  newMessage: (newMessage: IMessage) => void;
  typing: (room: string) => void;
  stopTyping: (room: string) => void;
}

export interface AppContextInterface {
  userInfo?: IUser | null;
  selectedChat?: IChat | null;
  chats?: IChat[] | null;
  setUserInfo?: React.Dispatch<React.SetStateAction<IUser | null>>;
  setSelectedChat?: React.Dispatch<React.SetStateAction<IChat | null>>;
  setChats?: React.Dispatch<React.SetStateAction<IChat[] | null>>;
  fetchAgain?: boolean;
  setFetchAgain?: React.Dispatch<React.SetStateAction<boolean>>;
  notification?: IMessage[] | null;
  setNotification?: React.Dispatch<React.SetStateAction<IMessage[]>>;
}

export interface ISignUpFormState {
  name: string;
  email: string;
  password: string;
  image: string;
}

export interface ILoginFormState {
  email: string;
  password: string;
}
