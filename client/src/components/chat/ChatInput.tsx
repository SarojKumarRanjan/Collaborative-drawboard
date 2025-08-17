import { useState } from "react";
import {socket} from "@/lib/Socket";
import { AiOutlineSend } from "react-icons/ai";


const ChatInput = () => {

    const [msg,setMsg] = useState("");

    const handleMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        socket.emit("send_msg", msg);
        setMsg("");
    }

    return (
        <form className="flex w-full items-center gap-2 " onSubmit={handleMessage}>
            <input
            placeholder="Type your message here..."
            className="w-full rounded-md border border-zinc-500  p-5 py-1 "
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            />
            <button
            type="submit"
            className="h-full w-10 cursor-grab bg-zinc-800 rounded-md  flex justify-center items-center "
            >
            <AiOutlineSend color="white" />
            </button>
        </form>
    );
}


export default ChatInput;