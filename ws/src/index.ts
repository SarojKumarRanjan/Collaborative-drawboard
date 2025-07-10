import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = new Map<string, Room>();
rooms.set("global", new Map<string, Move[]>());

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

const cleanupRoom = (roomId: string) => {
  const room = rooms.get(roomId);
  if (room && room.size === 0 && roomId !== "global") {
    rooms.delete(roomId);
    console.log(`Deleted empty room: ${roomId}`);
  }
};

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  const getRoomId = () => {
    const joinedRoom = [...socket.rooms].find((room) => room !== socket.id);
    if (!joinedRoom) {
      console.warn('No joined room found, falling back to socket.id');
      return socket.id;
    }
    return joinedRoom;
  };

  // create new room when user req
  socket.on("create_room", () => {
    console.log("create room received");
    
    let roomId: string;

    do {
      roomId = Math.random().toString(36).substring(2, 6);
    } while (rooms.has(roomId));

    socket.join(roomId);

    rooms.set(roomId, new Map<string, Move[]>());
    rooms.get(roomId)?.set(socket.id, []);

    console.log(`Room ${roomId} created with user ${socket.id}`);
    io.to(socket.id).emit("created", roomId);
  });

  // join room when user want to join
  socket.on("join_room", (roomId: string) => {
    console.log("join_room received for room:", roomId);
    console.log("Available rooms:", [...rooms.keys()]);
    
    if (rooms.has(roomId)) {
      socket.join(roomId);
      
      // Add user to room data structure immediately
      const room = rooms.get(roomId);
      if (room && !room.has(socket.id)) {
        room.set(socket.id, []);
      }
      
      console.log(`User ${socket.id} joined room ${roomId}`);
      io.to(socket.id).emit("joined", roomId);
    } else {
      console.log("Room not found:", roomId);
      io.to(socket.id).emit("joined", "", true);
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
      // Ensure user is in the room data (backup in case join_room didn't add them)
      if (!room.has(socket.id)) {
        room.set(socket.id, []);
      }
      
      io.to(socket.id).emit("room", JSON.stringify([...room]));
      socket.broadcast.to(roomId).emit("new_user", socket.id);
      console.log(`User ${socket.id} successfully joined room ${roomId}`);
    } else {
      console.warn(`joined_room: Room ${roomId} not found`);
      io.to(socket.id).emit("room", JSON.stringify([]));
    }
  });

  socket.on("leave_room", () => {
    console.log("leave_room received");
    
    const roomId = getRoomId();
    const room = rooms.get(roomId);
    
    if (room) {
      const userMoves = room.get(socket.id);
      if (userMoves && userMoves.length === 0) {
        room.delete(socket.id);
      }
      socket.leave(roomId);
      socket.broadcast.to(roomId).emit("user_left", socket.id);
      
      console.log(`User ${socket.id} left room ${roomId}`);
      cleanupRoom(roomId);
    }
  });

  socket.on("mouse_move", (x, y) => {
    console.log("mouse_move");
    
    const roomId = getRoomId();
    socket.broadcast.to(roomId).emit("mouse_moved", x, y, socket.id);
  });

  socket.on("draw", (move: Move) => {
    console.log("draw");
    
    const roomId = getRoomId();
    addMove(roomId, socket.id, move);
    socket.broadcast.to(roomId).emit("user_draw", move, socket.id);
  });

  socket.on("undo", () => {
    console.log("undo");
    
    const roomId = getRoomId();
    undoMove(roomId, socket.id);
    
    // Fixed: broadcast to room, not to socket.id
    socket.broadcast.to(roomId).emit("user_undo", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
    
    const roomId = getRoomId();
    const room = rooms.get(roomId);
    
    if (room) {
      room.delete(socket.id);
      socket.broadcast.to(roomId).emit("user_disconnected", socket.id);
      cleanupRoom(roomId);
    }
  });
});

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

// Debug endpoint to check room status
app.get("/debug/rooms", (req, res) => {
  const roomsData: Record<string, string[]> = {};
  for (const [roomId, room] of rooms) {
    roomsData[roomId] = [...room.keys()];
  }
  res.json({
    rooms: roomsData,
    totalRooms: rooms.size,
  });
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});