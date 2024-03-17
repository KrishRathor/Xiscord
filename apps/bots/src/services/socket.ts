import { Server } from "socket.io";

class SocketService {

    private _io: Server;

    constructor() {
        console.log(`Init Bot Socket Service...`);
        this._io = new Server({
            cors: {
                allowedHeaders: ['*'],
                origin: '*'
            }
        });
    }

    public initListeners () {
        console.log(`Started listeners...`);
        const io = this.io;

        io.on('connect', (socket) => {
            console.log(`${socket.id} connected to bot server...`);
        })
    }

    get io() {
        return this._io;
    }

}

export default SocketService;