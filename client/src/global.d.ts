export declare global{

    type Shape = "circle" | "rect" | "line" | "image";

    interface CtxOptions{
        lineWidth:number;
        lineColor:string;
        erase:boolean;
        shape:Shape
    }

    interface Move{
        circle:{
            cX:number,
            cY:number,
            radiusX:number,
            radiusY:number
        },
        rect:{
            width:number,
            height:number
        },
        img:{
            base64:string
        },
        path:[number,number][]
        options:CtxOptions
        timestamp: number;
        eraser:boolean
        id?:string    
    }

   interface Message {
        id: string;
        userId: string;
        username: string;
        message: string;
        color: string;
        timestamp: number;
    }

    type Room = {
        usersMoves :Map<string,Move[]>,
        drawed : Move[],
        users:Map<string,string>
    
    }


        interface ClientRoom {
        
        usersMoves: Map<string, Move[]>;
        movesWithoutUser: Move[];
        myMoves: Move[];
        users?: Map<string, string>;
        id?:string
    }

   interface serverToClientEvents{
       your_moves:(moves:Move) => void;
       new_msg:(userId:string,msg:Message,timestamp:number) => void;
       room_exists: (exists:boolean) => void;
       room:(room:Room,usersMovesToParse:string,usersToParse:string) => void,
       created:(roomId:string) => void
       joined:(roomId:string,failed?:boolean) => void;
        user_draw:(
            move:Move,
            userId:string
        )=>void;
        user_undo(userId:string): void
        mouse_moved:(x:number,y:number,userId:string) => void;
        new_user:(userId:string,username:string) => void;
        user_disconnected:(userId:string) => void;

        
    }
 interface clientToServerEvents{
        check_room:(roomId:string) => void
        draw:(move:Move)=>void;
        mouse_move:(x:number,y:number) => void;
        undo:() => void
        create_room: (username:string) => void
        join_room: (room:string,username:string) => void
        joined_room: () => void
        leave_room: () => void
        send_msg: (msg:Message) => void;

        
    }




}




export {}