import { io, Socket } from "socket.io-client";

type MessageHandler = (message: string, serverName: string, channelName: string) => void;

class Bot {
    private socket: Socket | null;
    private messageHandler: MessageHandler | null;
    private botName: string | null;


    constructor(botName: string) {
        this.socket = null;
        this.messageHandler = null;
        this.botName = botName;
    }

    connect(): void {
        this.socket = io(`http://localhost:8000`, {
          query: {
            botName: this.botName
          }
        });
    
        this.socket.on('connect', () => {
          console.log('Connected to server.');
        });
    
        this.socket.on('message:bot', (data: any) => {
          console.log('Received message:', data);
          const { content, serverName, channelName } = JSON.parse(data);

          if (this.messageHandler) {
            this.messageHandler(content, serverName, channelName);
          }

        });
    
        this.socket.on('error', (error: Error) => {
          console.error('Socket error:', error);
        });
    
        this.socket.on('disconnect', () => {
          console.log('Disconnected from server.');
        });
      }

      sendMessage(msg: string, serverName: string, channelName: string) {
        if (this.socket) {
            this.socket.emit('reply:from:bot', JSON.stringify({msg, serverName, channelName}));
        }
      }

      onMessage(handler: MessageHandler): void {
        this.messageHandler = handler;
      }

}

export default Bot;