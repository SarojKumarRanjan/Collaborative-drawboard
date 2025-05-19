

export const drawFromSocket = (
        socketMoves:[number,number][],
        socketOptions:CtxOptions,
        ctx:CanvasRenderingContext2D,
        afterDraw : ()=> void
    )=>{

        console.log(socketMoves)

        const tempCtx = ctx;
        if(tempCtx){
            tempCtx.lineWidth = socketOptions.lineWidth
            tempCtx.strokeStyle = socketOptions.lineColor

            tempCtx.beginPath()

            socketMoves.forEach(([x,y]) =>{
                
                tempCtx.lineTo(x,y)
                
            })
            tempCtx.stroke()
            tempCtx.closePath()
            afterDraw();
        }

    }

    type UserDrawings = [number, number][][];
type Users = Record<string, UserDrawings>;


export const drawOnUndo = (
    ctx:CanvasRenderingContext2D,
    savedMoves:[number,number][][],
    user:Users
) => {

    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
    Object.values(user).forEach((user) => {
       user.forEach((moves) => {
          ctx.beginPath();
          moves.forEach(([x ,y])=>{
            ctx.lineTo(x,y);
          })
          ctx.stroke()
          ctx.closePath();
       })
    })

    savedMoves.forEach((movesArr) =>{
         ctx.beginPath();
         movesArr.forEach(([x , y])=>{
            ctx.lineTo(x,y)
         })
         ctx.stroke()
         ctx.closePath()
    })
}