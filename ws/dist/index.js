"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
const rooms = new Map();
rooms.set("global", new Map());
const addMove = (roomId, socketId, move) => {
    var _a;
    const room = rooms.get(roomId);
    if (!room) {
        console.error(`Room ${roomId} not found!`);
        return;
    }
    if (!room.has(socketId)) {
        room.set(socketId, [move]);
    }
    else {
        (_a = room.get(socketId)) === null || _a === void 0 ? void 0 : _a.push(move);
    }
};
const undoMove = (roomId, socketId) => {
    const room = rooms.get(roomId);
    const moves = room === null || room === void 0 ? void 0 : room.get(socketId);
    if (moves && moves.length > 0) {
        moves.pop();
    }
};
// Socket.IO connection
io.on("connection", (socket) => {
    console.log("a user connected");
    socket.join("global");
    const globalRoom = rooms.get("global");
    if (globalRoom) {
        globalRoom.set(socket.id, []);
    }
    else {
        console.error("Global room not found on connection!");
    }
    io.to(socket.id).emit("joined", JSON.stringify([...rooms.get("global") || []]));
    // Notify all users about current users in the room
    const allUsers = io.sockets.adapter.rooms.get("global");
    console.log("Current users in room:", allUsers);
    if (allUsers) {
        io.to("global").emit("user_in_room", [...allUsers]);
    }
    socket.on("mouse_move", (x, y) => {
        socket.broadcast.emit("mouse_moved", x, y, socket.id);
    });
    socket.on("draw", (move) => {
        addMove("global", socket.id, move);
        socket.broadcast.emit("user_draw", move, socket.id);
    });
    socket.on("undo", () => {
        undoMove("global", socket.id);
        socket.broadcast.emit("user_undo", socket.id);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
        const room = rooms.get("global");
        room === null || room === void 0 ? void 0 : room.delete(socket.id);
        io.to("global").emit("user_disconnected", socket.id);
        const remainingUsers = io.sockets.adapter.rooms.get("global");
        if (remainingUsers) {
            io.to("global").emit("user_in_room", [...remainingUsers]);
        }
    });
});
// Express routes & middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.get("/api", (req, res) => {
    res.send("Hello API!");
});
server.listen(3001, () => {
    console.log("listening on *:3001");
});
