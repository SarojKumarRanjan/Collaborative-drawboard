export const handleMove = (move: Move, ctx: CanvasRenderingContext2D) => {
  const { path, options, radius, width, height } = move;

  if(path[0] == undefined) return

  if (ctx) {
    ctx.lineWidth = options.lineWidth;
    ctx.strokeStyle = options.lineColor;

    if (move.eraser) {
      ctx.globalCompositeOperation = "destination-out";
    }

    switch (options.shape) {
      case "line":
        ctx.beginPath();
        ctx.moveTo(path[0][0], path[0][1]);
        path.forEach(([x, y]) => {
          ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.closePath();
        break;
      case "rect":
        ctx.beginPath();
        ctx.rect(path[0][0], path[0][1], width, height);
        ctx.stroke();
        ctx.closePath();
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(path[0][0], path[0][1], radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
        break;
      default:
        break;
    }

    ctx.globalCompositeOperation = "source-over";
  }
};

export const drawAllMoves = (
  ctx: CanvasRenderingContext2D,
  room: ClientRoom,
  options: CtxOptions
) => {
  const { usersMoves, movesWithoutUser, myMoves } = room;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const moves = [...movesWithoutUser, ...myMoves];
  usersMoves.forEach((movesss) => {
    movesss.forEach((move) => {
      moves.push(move);
    });
  });

  //console.log({ moves });

  moves.sort((a, b) => a.timestamp - b.timestamp);

  moves.forEach((move) => {
    handleMove(move, ctx);
  });

  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = options.lineWidth;
  ctx.strokeStyle = options.lineColor;
  if (options.erase) {
    ctx.globalCompositeOperation = "destination-out";
  }
};

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number
) => {
  ctx.beginPath();
  const radius = Math.sqrt((x - from[0]) ** 2 + (y - from[1]) ** 2);
  ctx.arc(from[0], from[1], radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();

  return radius;
};

export const drawRect = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean
) => {
  ctx.beginPath();
  let width = x - from[0];
  let height = y - from[1];
  if (shift) {
    const d = Math.sqrt((x - from[0]) ** 2 + (y - from[1]) ** 2);
    width = height = d / Math.SQRT2;

    if (x - from[0] > 0 && y - from[0] < 0) {
      height = -height;
    } else if (y - from[1] > 0 && x - from[0] < 0) {
      width = -width;
    } else if (y - from[1] < 0 && x - from[0] < 0) {
      height = -height;
      width = -width;
    }
  } else {
    height = y - from[1];
    width = x - from[0];
  }

  ctx.rect(from[0], from[1], width, height);
  ctx.stroke();
  ctx.closePath();

  return { width, height };
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean
) => {
  if (shift) {
    ctx.beginPath();
    ctx.lineTo(from[0], from[1]);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();
  }

  ctx.lineTo(x, y);
  ctx.stroke();
};
