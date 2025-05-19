export declare global{
    interface CtxOptions{
        lineWidth:number;
        lineColor:string;
    }

   interface serverToClientEvents{
        user_draw:(
            newMoves:[number,number][],
            options:CtxOptions,
            userId:string
        )=>void;
        user_undo(userId:string): void
        mouse_moved:(x:number,y:number,socketId:string) => void;
        user_in_room:(socketIds:string[]) => void;
        user_disconnected:(socketId:string) => void;

        
    }
 interface clientToServerEvents{
        draw:(moves:[number,number][],options:CtxOptions)=>void;
        mouse_move:(x:number,y:number) => void;
        undo:() => void
        
    }
}

export {}