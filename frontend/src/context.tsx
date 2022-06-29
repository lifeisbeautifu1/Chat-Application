import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContextInterface, IUser, IChat,
IMessage } from './interfaces';
// import axios from 'axios';

export const AppContext = createContext<AppContextInterface>({});

interface Props {
  children?: React.ReactNode;
}

const AppContextProvider = ({ children }: Props) => {
  const [userInfo, setUserInfo] = useState<IUser | null>(null);

  const [notification, setNotification] = useState<IMessage []>([]);

  const [selectedChat, setSelectedChat] = useState<IChat | null>(null);

  const [chats, setChats] = useState<IChat[] | null>(null);

  const [fetchAgain, setFetchAgain] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('userInfo');
    if (user) {
      setUserInfo(JSON.parse(user));
      navigate('/chat');
    }
  }, [navigate]);

  return (
    <AppContext.Provider
      value={{
        userInfo,
        setUserInfo,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        fetchAgain,
        setFetchAgain,
        notification,
        setNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

export const useAppContext = () => useContext(AppContext);
