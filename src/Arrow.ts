import Victor from "victor"
import { DrawableObject, MouseState } from "./types"

export default class Arrow implements DrawableObject {

  canvas: HTMLCanvasElement
  mouseState: MouseState
  from: Victor
  to: Victor
  touchId: number

  constructor(canvas: HTMLCanvasElement, mouseState: MouseState, from: Victor, touchId: number) {
    this.canvas = canvas
    this.mouseState = mouseState
    this.from = from
    this.to = from.clone()
    this.touchId = touchId
  }

  update() {
    this.to = this.mouseState.pos[this.touchId]
  }

  draw() {
    this.drawArrow(this.from, this.to)
  }

  drawArrow(from: Victor, to: Victor) {
    const arrowLength = from.distance(to)
    const bodySize = Math.min(50, arrowLength / 10)
    const headSize = bodySize * 2;
    const angle = Math.atan2(to.y - from.y, to.x - from.x);

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error("Canvas context not found")

    ctx.save();
    ctx.fillStyle = 'orange';
    ctx.strokeStyle = 'orange';

    // Arrow body
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.lineWidth = bodySize;
    ctx.stroke();

    // Arrow head
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(to.x - headSize * Math.cos(angle - Math.PI / 7), to.y - headSize * Math.sin(angle - Math.PI / 7));
    ctx.lineTo(to.x - headSize * Math.cos(angle + Math.PI / 7), to.y - headSize * Math.sin(angle + Math.PI / 7));
    ctx.lineTo(to.x, to.y);
    ctx.lineTo(to.x - headSize * Math.cos(angle - Math.PI / 7), to.y - headSize * Math.sin(angle - Math.PI / 7));
    ctx.lineWidth = bodySize;
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }

}