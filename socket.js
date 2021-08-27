import { Server } from "socket.io";
let socketIO;

export const io = {
    init: httpServer => {
        console.log(3000)
        socketIO = new Server(httpServer, {
            cors: {
                origin: "http://localhost:1234",
                methods: ["GET", "POST"],
            }
        });
        return socketIO;
    },
    getIO: () => {
        if (!socketIO) {
            throw new Error('Socket.io not initialized!');
        }
        return socketIO;
    }
};