"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SocketIO = require("socket.io");
class Server {
    constructor(port) {
        this.port = port || 3121;
        this.socket = SocketIO();
    }
    start() {
        this.socket.listen(this.port);
    }
    stop() {
        return new Promise(resolve => {
            this.socket.close(resolve);
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map