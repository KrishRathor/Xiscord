import { Server } from "socket.io";

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
            console.log(`New Socket Connected ${socket.id}`)

            socket.on('event:message', async (data) => {
                console.log(`New message ${data}`);
            })

            socket.on('join:room', async roomId => {
                console.log(`New Room join Request ${roomId}`);
                socket.join(roomId);
            })

        })
    }

    get io() {
        return this._io;
    }

}

export default SocketService;