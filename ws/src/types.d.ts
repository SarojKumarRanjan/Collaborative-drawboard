
declare global{
    interface CtxOptions{
        lineWidth:number;
        lineColor:string;
    }

     interface serverToClientEvents{
        socket_draw:(newMoves:[number,number][],options:CtxOptions)=>void;
        mouse_moved:(x:number,y:number,socketId:string) => void;
        user_in_room:(socketIds:string[]) => void;

        
    }
 interface clientToServerEvents{
        draw:(moves:[number,number][],options:CtxOptions)=>void;
        mouse_move:(x:number,y:number) => void;
        
    }
}

export {}
