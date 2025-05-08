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


// Socket.IO connection

io.on("connection", (socket) => {
  console.log("a user connected");


 socket.on("draw",(moves,options) =>{
  console.log("recieving the drawing");

  socket.broadcast.emit("socket_draw",options,moves)
  

 })




  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
 
});






// Express routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
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
}
);


server.listen(3001, () => {
  console.log("listening on *:3001");
}
);