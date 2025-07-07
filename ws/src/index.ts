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


io.on("connection", (socket) => {
  console.log("a user connected");

  const getRoomId = () => {
    const joinedRoom = [...socket.rooms].find((room) => room != socket.id);
    if (!joinedRoom) return socket.id;

    return joinedRoom;
  };

  // create new room when user req

  socket.on("create_room", () => {
    console.log("create room recieved");
    
    let roomId: string;

    do {
      roomId = Math.random().toString(36).substring(2, 6);
    } while (rooms.has(roomId));

    socket.join(roomId);

    rooms.set(roomId, new Map());

    rooms.get(roomId)?.set(socket.id, []);

    io.to(socket.id).emit("created", roomId);
  });

  // join room when user want to join

  socket.on("join_room", (roomId: string) => {
    console.log("join_room room revievd");
    
    if (rooms.has(roomId)) {
      socket.join(roomId);

      io.to(socket.id).emit("joined", roomId);
    } else {
      io.to(socket.id).emit("joined", "", true);
    }
  });

  // lister to alert other users that a this user has joined room 

  socket.on("joined_room",() => {
    console.log('joined room recieved on the listner joined_room');

    const roomId = getRoomId();

    rooms.get(roomId)?.set(socket.id,[])

    io.to(socket.id).emit("room",JSON.stringify([...rooms.get(roomId)!]))

    socket.broadcast.to(roomId).emit("new_user",socket.id)


    
  })


  socket.on("leave_room",() =>{

    console.log("leave_room");
    
    const roomId = getRoomId();

    const user = rooms.get(roomId)?.get(socket.id)

    if(user?.length === 0 ) rooms.get(roomId)?.delete(socket.id)
  })

  socket.on("mouse_move", (x, y) => {
    console.log("mouse_move");
    
    const roomId = getRoomId();
    socket.broadcast.to(roomId).emit("mouse_moved", x, y, socket.id);
  });

  socket.on("draw", (move: Move) => {

    console.log("draw");
    
    const roomId = getRoomId()
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
    room?.delete(socket.id);
    io.to(getRoomId()).emit("user_disconnected", socket.id);
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

server.listen(3001, () => {
  console.log("listening on *:3001");
});
