import * as SocketIO from 'socket.io';
import { Server as SocketServer } from 'socket.io';

export class Server {

    private port : number;
    private socket : SocketServer;

    /**
     * Constructs a new server instance.
     */
    constructor(port?: number) {
        this.port = port || 3121;
        this.socket = SocketIO();
    }

    /**
     * Starts the server.
     */
    public start() {
        this.socket.listen(this.port);
    }

    /**
     * Stops the server.
     */
    public stop() : Promise<void> {
        return new Promise(resolve => {
            this.socket.close(resolve);
        });
    }

}