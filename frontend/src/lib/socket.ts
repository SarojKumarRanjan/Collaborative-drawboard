import {io,Socket} from "socket.io-client"

export const socket:Socket = io("ws://localhost:3001");


