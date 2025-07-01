import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

/*


rooms: Map<string, Room>

Room: Map<string, Move[]>

Move: {
  path: [ [number, number], ... ],
  options: {
    lineWidth: number,
    lineColor: string,
  }
}
*/

// type Move = {
//   path: [number, number][];
//   options: {
//     lineWidth: number;
//     lineColor: string;
//   };
// };

type Room = Map<string, Move[]>;

const rooms = new Map<string, Room>();
rooms.set("global", new Map());

const addMove = (roomId: string, socketId: string, move: Move) => {
  const room = rooms.get(roomId);
  if (!room) {
    console.error(`Room ${roomId} not found!`);
    return;
  }
  if (!room.has(socketId)) {
    room.set(socketId, [move]);
  } else {
    room.get(socketId)?.push(move);
  }
};

const undoMove = (roomId: string, socketId: string) => {
  const room = rooms.get(roomId);
  const moves = room?.get(socketId);
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
  } else {
    console.error("Global room not found on connection!");
  }

  io.to(socket.id).emit(
    "joined",
    JSON.stringify([...rooms.get("global") || []])
  );

  // Notify all users about current users in the room
  const allUsers = io.sockets.adapter.rooms.get("global");
  console.log("Current users in room:", allUsers);
  if (allUsers) {
    io.to("global").emit("user_in_room", [...allUsers]);
  }

  socket.on("mouse_move", (x, y) => {
    socket.broadcast.emit("mouse_moved", x, y, socket.id);
  });

  socket.on("draw", (move: Move) => {
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
    room?.delete(socket.id);
    io.to("global").emit("user_disconnected", socket.id);

    const remainingUsers = io.sockets.adapter.rooms.get("global");
    if (remainingUsers) {
      io.to("global").emit("user_in_room", [...remainingUsers]);
    }
  });
});

// Express routes & middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
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
