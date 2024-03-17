import { io, Socket } from "socket.io-client";

class Bot {
    private socket: Socket | null;

    constructor() {
        this.socket = null;
    }

    connect(): void {
        console.log(`I was called`);
        this.socket = io(`http://localhost:8000`);
    
        this.socket.on('connect', () => {
          console.log('Connected to server.');
        });
    
        this.socket.on('message', (data: any) => {
          console.log('Received message:', data);
        });
    
        this.socket.on('error', (error: Error) => {
          console.error('Socket error:', error);
        });
    
        this.socket.on('disconnect', () => {
          console.log('Disconnected from server.');
        });
      }

}

export default Bot;