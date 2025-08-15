import roomStore from "@/store/room.store";
import { useEffect, useRef, useState } from "react";
import { useList } from "react-use";
import { colorStore } from "@/store/Options.store";
import { socket } from "@/lib/Socket";
import {motion} from "motion/react";
import { DEFAULT_EASE } from "@/constant";
import { BsChatFill } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa";
import Message from "./Message";
import ChatInput from "./ChatInput";

const Chat = () => {

    const msgList = useRef<HTMLDivElement>(null);

    const [opened,setOpened] = useState(false);
    const [newMsg,setNewMsg] = useState(false);
    const [messages,setMessages] = useList<Message>([]);

    const users = roomStore((state) => state.users)

useEffect(() => {

    const handleNewMsg  = (userId:string,msg:string,timestamp:number) => {
        const user = users.get(userId);

        setMessages.push({
            userId,
            message:msg,
            id:(messages.length + 1).toString(),
            username:user || "Unknown",
            color: user ? colorStore.getState().getColor(userId) : "#000",
            timestamp
        })

        msgList.current?.scrollTo({
            top: msgList.current.scrollHeight,
            behavior: "smooth"
        })

        if(!opened) {
            setNewMsg(true);
        }

    }

    socket.on("new_msg", handleNewMsg);

    return () => {
        socket.off("new_msg", handleNewMsg);
    }

},[opened,messages,users,setMessages]);


    return (
        <motion.div
        className="absolute bottom-0 left-36 z-30 flex h-[300px] w-[30rem] flex-col overflow-hidden rounded-t-md border p-1"
        animate={{
            y:opened ? 0 : 260,
            transition:{
                ease:DEFAULT_EASE,duration:0.2
            }
        }}
        >

            <button className="flex w-full cursor-pointer items-center jstify-between bg-zinc-800 py-2 px-10 font-semibold text-white"
            onClick={() => {
                setOpened((prev) => !prev)
                setNewMsg(false);
            }}
            >
                <div className="flex items-center gap-2">
                    <BsChatFill className="mt-[-2px]"/>
                    Chat
                    {
                        newMsg && (
                            <p className="rounded-md bg-green-500 px-1 font-semibold text-green-900">
                                New!
                            </p>
                        )

                    }

                </div>
                <motion.div
                animate={
                    {
                        rotate: opened ? 0 : 180,
                        transition:{
                            ease:DEFAULT_EASE,
                            duration:0.2
                        }
                    }
                }
                >

                    <FaChevronDown />

                </motion.div>

            </button>

            <div className="flex flex-1 flex-col justify-between bg-white p-3" >
               <div className="h-[190px] overflow-y-scroll pr-2" ref={msgList}>
                {
                    messages.map((msg) => (
                        <Message key={msg.id} {...msg} />
                    ))
                }

               </div>
               <ChatInput />
            </div>

        </motion.div>
    );
}


export default Chat;    