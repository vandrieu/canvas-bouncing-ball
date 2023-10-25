import { DrawableObject, MouseState } from "./types"

export default class Arrow implements DrawableObject {

  canvas: HTMLCanvasElement
  mouseState: MouseState
  fromX: number
  fromY: number
  toX: number
  toY: number
  touchId: number

  constructor(canvas: HTMLCanvasElement, mouseState: MouseState, fromX: number, fromY: number, touchId: number) {
    this.canvas = canvas
    this.mouseState = mouseState
    this.fromX = fromX
    this.fromY = fromY
    this.toX = fromX
    this.toY = fromY
    this.touchId = touchId
  }

  update() {
    this.toX = this.mouseState.pos[this.touchId].x
    this.toY = this.mouseState.pos[this.touchId].y
  }

  draw() {
    this.drawArrow(this.fromX, this.fromY, this.toX, this.toY)
  }

  drawArrow(fromx: number, fromy: number, tox: number, toy: number) {
    const arrowLength = Math.sqrt((fromx - tox) ** 2 + (fromy - toy) ** 2);
    const bodySize = Math.min(50, arrowLength / 10)
    const headSize = bodySize * 2;
    const angle = Math.atan2(toy - fromy, tox - fromx);

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error("Canvas context not found")

    ctx.save();
    ctx.fillStyle = 'orange';
    ctx.strokeStyle = 'orange';

    // Arrow body
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineWidth = bodySize;
    ctx.stroke();

    // Arrow head
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headSize * Math.cos(angle - Math.PI / 7), toy - headSize * Math.sin(angle - Math.PI / 7));
    ctx.lineTo(tox - headSize * Math.cos(angle + Math.PI / 7), toy - headSize * Math.sin(angle + Math.PI / 7));
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox - headSize * Math.cos(angle - Math.PI / 7), toy - headSize * Math.sin(angle - Math.PI / 7));
    ctx.lineWidth = bodySize;
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }

}