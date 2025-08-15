import {socket} from "@/lib/Socket"
const Message = ({userId,message,username,color}:Message) => {

    const me = userId === socket.id;
    return (
       <div className={ `my-2 flex gap-2 text-clip ${me && "justify-end text-right"}`}>
       {!me && (
        <h5 style={{color}} className="font-bold">
            {username}
        </h5>
       )}
       <p 
       style={{wordBreak:"break-all"}}
       >
        {message}
       </p>
       </div>
    );
}


export default Message;