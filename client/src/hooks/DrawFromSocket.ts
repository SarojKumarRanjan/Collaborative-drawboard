





export const handleMove = (
        move:Move,
        ctx:CanvasRenderingContext2D,
        
    )=>{ 
 
      

        const {path,options} = move;

       

        const tempCtx = ctx;
        if(tempCtx){
            tempCtx.lineWidth = options.lineWidth
            tempCtx.strokeStyle = options.lineColor

            if(move.eraser){
                tempCtx.globalCompositeOperation = "destination-out";
            }

            tempCtx.beginPath()

            path.forEach(([x,y]) =>{
                
                tempCtx.lineTo(x,y)
                
            })
            tempCtx.stroke()
            tempCtx.closePath()


           tempCtx.globalCompositeOperation = "source-over";
        }

    }






export const drawAllMoves = (
    ctx:CanvasRenderingContext2D,
     room:ClientRoom,
) => {

    const {usersMoves , movesWithoutUser, myMoves} = room;

    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)

   // console.log("Drawing all moves",usersMoves, movesWithoutUser, myMoves);

   const moves = [...movesWithoutUser,...myMoves]
    usersMoves.forEach((movesss) => {
       console.log(movesss);
    })

    moves.sort((a,b) => a.timestamp - b.timestamp)

    moves.forEach((move) => {
        handleMove(move, ctx)
    })

}



