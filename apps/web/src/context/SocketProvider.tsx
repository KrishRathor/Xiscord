import React, { useCallback, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

interface SocketProviderProps {
    children?: React.ReactNode
}

interface ISocketContext {
    sendMessage: (msg: string) => any,
    joinRoom: (roomId: string) => any,
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) throw new Error(`state is undefined`);
  
    return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {

    const [socket, setSocket] = useState<Socket>();

    const sendMessage: ISocketContext['sendMessage'] =  useCallback((msg: string) => {
        console.log(`Send Message Called`, msg);
    }, [socket]);

    const joinRoom: ISocketContext['joinRoom'] = useCallback((roomId: string) => {
        if (socket) {
            socket.emit('join:room', roomId);
        }
    }, [socket]);

    useEffect(() => {

        const _socket = io(`http://localhost:8000`);

        setSocket(_socket);

        return () => {
            _socket.disconnect();
        }

    }, [])

    return (
        <SocketContext.Provider value={{sendMessage, joinRoom}}>
            {children}
        </SocketContext.Provider>
    )
}