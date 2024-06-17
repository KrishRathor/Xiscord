import React, { useCallback, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import jwt, { JwtPayload } from "jsonwebtoken";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string, fromEmail: string, toEmail: string) => any;
  joinServerRoom: (serverName: string) => any;
  sendMessageInServer: (
    msg: string,
    serverName: string,
    channelName: string,
    from: string
  ) => any;
  sendDataAfterLogin: () => any;
  sendMessageToBot: (
    msg: string,
    serverName: string,
    channelName: string
  ) => any;
  serverMessage: any;
  onlineUsers: string[];
  messages: any;
}

interface IMessages {
  msg: string;
  fromEmail: string;
  toEmail: string;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`state is undefined`);
  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<IMessages[]>([]);
  const [serverMessage, setServerMessage] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg: string, fromEmail: string, toEmail: string) => {
      socket?.emit(
        "event:message",
        JSON.stringify({ msg, fromEmail, toEmail })
      );
      setMessages((prev) => [...prev, { msg, fromEmail, toEmail }]);
    },
    [socket]
  );

  const joinServerRoom: ISocketContext["joinServerRoom"] = useCallback(
    (serverName: string) => {
      socket?.emit("event:join:server", JSON.stringify({ serverName }));
    },
    [socket]
  );

  const sendMessageInServer: ISocketContext["sendMessageInServer"] =
    useCallback(
      (msg: string, serverName: string, channelName: string, from: string) => {
        socket?.emit(
          "event:send:message:server",
          JSON.stringify({ serverName, channelName, msg, from })
        );
      },
      [socket]
    );

  const sendMessageToBot: ISocketContext["sendMessageToBot"] = useCallback((
    msg: string, serverName: string, channelName: string
  ) => {
    const data = {msg, serverName, channelName}
    socket?.emit('message:server:bot', JSON.stringify(data));
  }, [socket])

  const sendDataAfterLogin: ISocketContext["sendDataAfterLogin"] =
    useCallback(() => {
      const token = localStorage.getItem("token") ?? "";
      //@ts-ignore
      const userToken = jwt.decode(token)?.email;
      socket?.emit("email:after:login", userToken);
    }, [socket]);

  const onMessageReply = useCallback((data: any) => {
    const { msg, fromEmail, toEmail } = JSON.parse(data);
    setMessages((prev) => [...prev, { msg, fromEmail, toEmail }]);
  }, []);

  const onServerMessageReply = useCallback((data: any) => {
    //@ts-ignore
    setServerMessage((prev) => [...prev, JSON.parse(data)]);
  }, []);

  const getOnlineUsersList = useCallback((data: any) => {
    const keys = Object.keys(data);
    setOnlineUsers((_prev) => keys);
  }, []);

  const getReplyFromBot = useCallback((data: any) => {
    const {msg, serverName, channelName} = JSON.parse(data);
    //@ts-ignore
    setServerMessage(prev => [...prev, {
      serverName,
      channelName,
      msg,
      from: 'Bot'
    }])
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    const _socket = io(`http://localhost:8000`, {
      query: {
        //@ts-ignore
        userToken: jwt.decode(token)?.email,
      },
    });

    _socket.on("event:message:reply", onMessageReply);
    _socket.on("event:send:message:server:reply", onServerMessageReply);
    _socket.on("event:online:user", getOnlineUsersList);
    _socket.on("reply:from:bot:to:client", getReplyFromBot);

    setSocket((_prev) => _socket);

    return () => {
      _socket.off("event:message:reply", onMessageReply);
      _socket.off("event:send:message:server:reply", onServerMessageReply);
      _socket.off("event:online:user", getOnlineUsersList);
      _socket.off("reply:from:bot:to:client", getReplyFromBot);
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        sendMessage,
        joinServerRoom,
        sendMessageInServer,
        sendDataAfterLogin,
        sendMessageToBot,
        messages,
        serverMessage,
        onlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
