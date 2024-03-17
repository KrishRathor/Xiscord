import { io, Socket } from "socket.io-client";

type MessageHandler = (message: string) => void;

class Bot {
    private socket: Socket | null;
    private messageHandler: MessageHandler | null;

    constructor() {
        this.socket = null;
        this.messageHandler = null;
    }

    connect(): void {
        console.log(`I was called`);
        this.socket = io(`http://localhost:8000`);
    
        this.socket.on('connect', () => {
          console.log('Connected to server.');
        });
    
        this.socket.on('message:bot', (data: any) => {
          console.log('Received message:', data);

          if (this.messageHandler) {
            this.messageHandler(data);
          }

        });
    
        this.socket.on('error', (error: Error) => {
          console.error('Socket error:', error);
        });
    
        this.socket.on('disconnect', () => {
          console.log('Disconnected from server.');
        });
      }

      sendMessage(msg: string) {
        if (this.socket) {
            console.log('i was here');
            this.socket.emit('reply:from:bot', msg);
        }
      }

      onMessage(handler: MessageHandler): void {
        this.messageHandler = handler;
      }

}

export default Bot;