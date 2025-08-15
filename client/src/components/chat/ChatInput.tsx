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
            className="w-full rounded-md border border-zinc-300 bg-zinc-800 text-white p-5 py-1 "
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            />
            <button
            type="submit"
            className="h-full w-10 bg-black "
            >
            <AiOutlineSend />
            </button>
        </form>
    );
}


export default ChatInput;