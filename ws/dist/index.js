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
const addMove = (roomId, socketId, move) => {
    var _a;
    const room = rooms.get(roomId);
    if (!room) {
        console.error(`Room ${roomId} not found!`);
        return;
    }
    if (!room.usersMoves.has(socketId)) {
        room.usersMoves.set(socketId, []);
    }
    (_a = room.usersMoves.get(socketId)) === null || _a === void 0 ? void 0 : _a.push(move);
};
const undoMove = (roomId, socketId) => {
    const room = rooms.get(roomId);
    const moves = room === null || room === void 0 ? void 0 : room.usersMoves.get(socketId);
    if (moves && moves.length > 0) {
        moves.pop();
    }
};
const leaveRoom = (roomId, socketId) => {
    const room = rooms.get(roomId);
    if (!room) {
        return;
    }
    const userMoves = room === null || room === void 0 ? void 0 : room.usersMoves.get(socketId);
    if (userMoves && userMoves.length > 0) {
        room === null || room === void 0 ? void 0 : room.drawed.push(...(userMoves || []));
    }
    room === null || room === void 0 ? void 0 : room.usersMoves.delete(socketId);
    room === null || room === void 0 ? void 0 : room.users.delete(socketId);
    console.log(`User ${socketId} left room ${roomId}`);
    if (room.users.size === 0) {
        rooms.delete(roomId);
        console.log(`Room ${roomId} deleted as it has no users left`);
    }
};
io.on("connection", (socket) => {
    console.log("a user connected:", socket.id);
    const getRoomId = () => {
        const joinedRoom = [...socket.rooms].find((room) => room !== socket.id);
        if (!joinedRoom) {
            return socket.id;
        }
        return joinedRoom;
    };
    socket.on("create_room", (username) => {
        console.log("create room received");
        let roomId;
        do {
            roomId = Math.random().toString(36).substring(2, 6);
        } while (rooms.has(roomId));
        socket.join(roomId);
        rooms.set(roomId, { usersMoves: new Map([[socket.id, []]]), drawed: [], users: new Map([[socket.id, username]]) });
        console.log(`Room ${roomId} created with user ${socket.id}`);
        io.to(socket.id).emit("created", roomId);
    });
    socket.on("join_room", (roomId, username) => {
        console.log("join_room received for room:", roomId);
        if (!roomId || roomId.trim() === "") {
            console.error("Invalid room ID provided");
            return;
        }
        if (rooms.has(roomId)) {
            socket.join(roomId);
            const room = rooms.get(roomId);
            if (room && !room.usersMoves.has(socket.id) && !room.users.has(socket.id)) {
                room.usersMoves.set(socket.id, []);
                room.users.set(socket.id, username);
            }
            console.log(`User ${socket.id} joined room ${roomId}`);
            io.to(socket.id).emit("joined", roomId);
        }
    });
    // listen to check if room exists
    socket.on("check_room", (roomId) => {
        console.log("check_room received for room:", roomId);
        if (rooms.has(roomId)) {
            console.log(`Room ${roomId} exists`);
            io.to(socket.id).emit("room_exists", true);
        }
        else {
            console.log(`Room ${roomId} does not exist`);
            io.to(socket.id).emit("room_exists", false);
        }
    });
    // listen to alert other users that this user has joined room 
    socket.on("joined_room", () => {
        console.log('joined_room received');
        const roomId = getRoomId();
        console.log('Current room ID:', roomId);
        console.log('Socket rooms:', [...socket.rooms]);
        const room = rooms.get(roomId);
        if (room) {
            if (!room.usersMoves.has(socket.id)) {
                room.usersMoves.set(socket.id, []);
            }
            io.to(socket.id).emit("room", room, JSON.stringify([...room.usersMoves]), JSON.stringify([...room.users]));
            const username = room.users.get(socket.id) || "Unknown User";
            socket.broadcast.to(roomId).emit("new_user", socket.id, username);
            console.log(`User ${socket.id} successfully joined room ${roomId}`);
        }
    });
    socket.on("leave_room", () => {
        console.log("leave_room received");
        const roomId = getRoomId();
        leaveRoom(roomId, socket.id);
        io.to(socket.id).emit("user_disconnected", socket.id);
    });
    socket.on("mouse_move", (x, y) => {
        const roomId = getRoomId();
        socket.broadcast.to(roomId).emit("mouse_moved", x, y, socket.id);
    });
    socket.on("draw", (move) => {
        console.log("draw");
        const roomId = getRoomId();
        const timestamp = Date.now();
        addMove(roomId, socket.id, Object.assign(Object.assign({}, move), { timestamp }));
        io.to(socket.id).emit("your_moves", Object.assign(Object.assign({}, move), { timestamp }));
        socket.broadcast.to(roomId).emit("user_draw", Object.assign(Object.assign({}, move), { timestamp }), socket.id);
    });
    socket.on("send_msg", (msg) => {
        console.log("send_msg");
        const roomId = getRoomId();
        const timestamp = Date.now();
        io.to(roomId).emit("new_msg", socket.id, msg, timestamp);
    });
    socket.on("undo", () => {
        console.log("undo");
        const roomId = getRoomId();
        undoMove(roomId, socket.id);
        socket.broadcast.to(roomId).emit("user_undo", socket.id);
    });
    socket.on("disconnecting", () => {
        console.log("user disconnected:", socket.id);
        leaveRoom(getRoomId(), socket.id);
        io.to(socket.id).emit("user_disconnected", socket.id);
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
// Debug endpoint to check room status
app.get("/debug/rooms", (req, res) => {
    const roomsData = {};
    for (const [roomId, room] of rooms) {
        roomsData[roomId] = [...room.users.keys()];
    }
    res.json({
        rooms: roomsData,
        totalRooms: rooms.size,
    });
});
server.listen(3001, () => {
    console.log("listening on *:3001");
});
