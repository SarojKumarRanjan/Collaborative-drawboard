 declare global{
    interface CtxOptions{
        lineWidth:number;
        lineColor:string;
    }

   interface serverToClientEvents{
        socket_draw:(newMoves:[number,number][],options:CtxOptions)=>void;
        
    }
 interface clientToServerEvents{
        draw:(moves:[number,number][],options:CtxOptions)=>void;
        
    }
}

export {}