

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?:boolean
) => {
  ctx.beginPath();

  const cX = (x+from[0])/2;
  const cY = (y+from[1])/2; 

  let radiusX = 0
  let radiusY = 0
  if(shift){
   const distance = Math.sqrt((x - from[0]) ** 2 + (y - from[1]) ** 2);
   radiusX = distance /Math.SQRT2/2;
   radiusY = distance /Math.SQRT2/2;
  }else{
    radiusX = Math.abs(x - from[0]) ;
    radiusY = Math.abs(y - from[1]) ;
  }

  ctx.ellipse(cX, cY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();

  return { cX, cY, radiusX, radiusY };
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
