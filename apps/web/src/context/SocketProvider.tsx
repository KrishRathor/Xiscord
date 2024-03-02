import React, { useCallback, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import jwt, { JwtPayload } from "jsonwebtoken";

interface SocketProviderProps {
    children?: React.ReactNode
}

interface ISocketContext {
    sendMessage: (msg: string, fromEmail: string, toEmail: string) => any,
    messages: any
    // joinRoom: (roomId: string) => any,
}

interface IMessages {
    msg: string,
    fromEmail: string,
    toEmail: string
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) throw new Error(`state is undefined`);
  
    return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {

    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<IMessages[]>([]);

    const sendMessage = useCallback((msg: string, fromEmail: string, toEmail: string) => {
        socket?.emit('event:message', JSON.stringify({msg, fromEmail, toEmail}));
        setMessages(prev => [...prev, {msg, fromEmail, toEmail}]);
    }, [socket]);

    const onMessageReply = useCallback((data: any) => {
        const { msg, fromEmail, toEmail } = JSON.parse(data);
        console.log('recieved from backend', data);
        setMessages(prev => [...prev, { msg, fromEmail, toEmail }]);
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('token') ?? '';
        const _socket = io(`http://localhost:8000`, {
            query: {
                //@ts-ignore
                userToken: jwt.decode(token)?.email
            }
        });

        _socket.on('event:message:reply', onMessageReply);

        setSocket(_prev => _socket);

        return () => {
            _socket.off('event:message:reply', onMessageReply)
            _socket.disconnect();
            setSocket(undefined);
        }
    }, [])

    return (
        <SocketContext.Provider value={{sendMessage, messages}}>
            {children}
        </SocketContext.Provider>
    )
}