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
// Socket.IO connection
io.on("connection", (socket) => {
    console.log("a user connected");
    socket.join("global");
    socket.on("mouse_move", (x, y) => {
        console.log("mouse moved");
        socket.broadcast.emit("mouse_moved", x, y, socket.id);
    });
    socket.on("draw", (moves, options) => {
        console.log(moves, options);
        console.log("recieving the drawing");
        socket.broadcast.emit("socket_draw", options, moves);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
    const allUsers = io.sockets.adapter.rooms.get("global");
    console.log(allUsers);
    if (allUsers) {
        return io.to("global").emit("user_in_room", [...allUsers]);
    }
});
// Express routes
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
