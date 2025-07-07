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
io.on("connection", (socket) => {
    console.log("a user connected");
    const getRoomId = () => {
        const joinedRoom = [...socket.rooms].find((room) => room != socket.id);
        if (!joinedRoom)
            return socket.id;
        return joinedRoom;
    };
    // create new room when user req
    socket.on("create_room", () => {
        var _a;
        console.log("create room recieved");
        let roomId;
        do {
            roomId = Math.random().toString(36).substring(2, 6);
        } while (rooms.has(roomId));
        socket.join(roomId);
        rooms.set(roomId, new Map());
        (_a = rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.set(socket.id, []);
        io.to(socket.id).emit("created", roomId);
    });
    // join room when user want to join
    socket.on("join_room", (roomId) => {
        console.log("join_room room revievd");
        if (rooms.has(roomId)) {
            socket.join(roomId);
            io.to(socket.id).emit("joined", roomId);
        }
        else {
            io.to(socket.id).emit("joined", "", true);
        }
    });
    // lister to alert other users that a this user has joined room 
    socket.on("joined_room", () => {
        var _a;
        console.log('joined room recieved on the listner joined_room');
        const roomId = getRoomId();
        (_a = rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.set(socket.id, []);
        io.to(socket.id).emit("room", JSON.stringify([...rooms.get(roomId)]));
        socket.broadcast.to(roomId).emit("new_user", socket.id);
    });
    socket.on("leave_room", () => {
        var _a, _b;
        console.log("leave_room");
        const roomId = getRoomId();
        const user = (_a = rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.get(socket.id);
        if ((user === null || user === void 0 ? void 0 : user.length) === 0)
            (_b = rooms.get(roomId)) === null || _b === void 0 ? void 0 : _b.delete(socket.id);
    });
    socket.on("mouse_move", (x, y) => {
        console.log("mouse_move");
        const roomId = getRoomId();
        socket.broadcast.to(roomId).emit("mouse_moved", x, y, socket.id);
    });
    socket.on("draw", (move) => {
        console.log("draw");
        const roomId = getRoomId();
        addMove(roomId, socket.id, move);
        socket.broadcast.to(roomId).emit("user_draw", move, socket.id);
    });
    socket.on("undo", () => {
        console.log("undo");
        const roomId = getRoomId();
        undoMove(roomId, socket.id);
        socket.broadcast.to(socket.id).emit("user_undo", socket.id);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
        const room = rooms.get(getRoomId());
        room === null || room === void 0 ? void 0 : room.delete(socket.id);
        io.to(getRoomId()).emit("user_disconnected", socket.id);
    });
});
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
