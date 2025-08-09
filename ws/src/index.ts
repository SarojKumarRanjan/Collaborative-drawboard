import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";


const app = express();
const server = createServer(app);

const io = new Server<clientToServerEvents, serverToClientEvents>(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = new Map<string, Room>();


const addMove = (roomId: string, socketId: string, move: Move) => {
  const room = rooms.get(roomId);
  if (!room) {
    console.error(`Room ${roomId} not found!`);
    return;
  }
  if (!room.users.has(socketId)) {
    room.users.set(socketId, [move]);
  } 

    
    room.users.get(socketId)?.push(move);
  
};

const undoMove = (roomId: string, socketId: string) => {
  const room = rooms.get(roomId);
  const moves = room?.users.get(socketId);
  if (moves && moves.length > 0) {
    moves.pop();
  }
};

const leaveRoom = (roomId: string,socketId: string) => {
  const room = rooms.get(roomId);
 const userMoves = room?.users.get(socketId);
 room?.drawed.push(...(userMoves || []));
  room?.users.delete(socketId);

  console.log(`User ${socketId} left room ${roomId}`);

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

  
  socket.on("create_room", () => {
    console.log("create room received");
    
    let roomId: string;

    do {
      roomId = Math.random().toString(36).substring(2, 6);
    } while (rooms.has(roomId));

    socket.join(roomId);

    rooms.set(roomId,{ users: new Map<string, Move[]>(), drawed: [] });
    rooms.get(roomId)?.users.set(socket.id, []); 

    console.log(`Room ${roomId} created with user ${socket.id}`);
    io.to(socket.id).emit("created", roomId);
  });

  
  socket.on("join_room", (roomId: string) => {
    console.log("join_room received for room:", roomId);
    
    
    if (rooms.has(roomId)) {
      socket.join(roomId);
      
     
      const room = rooms.get(roomId);
      if (room && !room.users.has(socket.id)) {
        room.users.set(socket.id, []);
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
      
      if (!room.users.has(socket.id)) {
        room.users.set(socket.id, []);
      }
      
      io.to(socket.id).emit("room",room, JSON.stringify([...room.users])); 
      socket.broadcast.to(roomId).emit("new_user", socket.id);
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
    
    
    socket.broadcast.to(roomId).emit("user_undo", socket.id);
  });

  socket.on("disconnecting", () => {
    console.log("user disconnected:", socket.id);
    leaveRoom(getRoomId(), socket.id);
    io.to(socket.id).emit("user_disconnected", socket.id);
    
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