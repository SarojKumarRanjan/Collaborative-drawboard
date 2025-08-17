

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
