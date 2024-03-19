import { Server } from "socket.io";

const users: any = {};
const botSocketMap: any = {};

class SocketService {

    private _io: Server;

    constructor() {
        console.log(`Init Socket Service...`);
        this._io = new Server({
            cors: {
                allowedHeaders: ['*'],
                origin: '*'
            }
        });
    }

    public initListeners () {
        console.log(`Initialised Socket Listeners...`);
        const io = this.io;

        io.on('connect', socket => {
            console.log(`New Socket Connected ${socket.id}`);
            const token = socket.handshake.query.userToken;
            if (typeof token === "string") {
                users[token] = socket.id;
            }
            const BotName = socket.handshake.query.botName;
            typeof BotName === "string" ? botSocketMap[BotName] = socket.id : "";

            socket.on('event:message', data => {
                console.log(users, data);
                const { msg, fromEmail, toEmail } = JSON.parse(data);
                console.log(fromEmail, toEmail);
                const toSocketId = users[toEmail];
                io.to(toSocketId).emit('event:message:reply', JSON.stringify({msg, fromEmail, toEmail}));
            })

            socket.on('event:join:server', data => {
                const { serverName } = JSON.parse(data);
                console.log(serverName);
                socket.join(serverName);
                socket.emit('event:online:user', users);
            })

            socket.on('event:send:message:server', data => {
                const { serverName, channelName, msg, from } = JSON.parse(data);
                console.log(serverName, channelName, msg, from);
                io.to(serverName).emit('event:send:message:server:reply', data);
            })

            socket.on('email:after:login', data => {
                console.log('here =>', data);
                users[data] = socket.id;
            })

            socket.on('message:server:bot', data => {
                const { msg, serverName, channelName } = JSON.parse(data);
                console.log('from bot', msg, serverName, channelName);
                const bot = msg.split(" ")[0].slice(1);
                const botSocketId = botSocketMap[bot];
                if (botSocketId) {
                    const firstEnd = msg.indexOf(' ');
                    if (firstEnd !== -1) {
                        const content = msg.substring(firstEnd + 1);
                        io.to(botSocketId).emit('message:bot', JSON.stringify({content, serverName, channelName}));
                    } else {
                        console.log(`no content`);
                    }
                } else {    
                    console.log(`Bot not online`)
                }
            })

            socket.on('reply:from:bot', (data) => {
                console.log(`recieved reply from bot`, data);
                const { msg, serverName, channelName } = JSON.parse(data);
                io.to(serverName).emit('reply:from:bot:to:client', JSON.stringify({msg, serverName, channelName}));
            })

            socket.on('disconnect', () => {
                console.log('User disconnected');
                // Remove the user from the users object
                for (const userId in users) {
                    if (users[userId] === socket.id) {
                        delete users[userId];
                        break;
                    }
                }
            });

        })
    }

    get io() {
        return this._io;
    }

}

export default SocketService;