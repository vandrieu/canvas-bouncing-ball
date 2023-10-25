import { DrawableObject } from "./types"

type BallInitParams = {
  x?: number
  y?: number
  speedX?: number
  speedY?: number
}

export default class Ball implements DrawableObject {

  canvas: HTMLCanvasElement
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  lastTickMs: number

  constructor(canvas: HTMLCanvasElement, params: BallInitParams = {}) {
    this.canvas = canvas;
    this.x = params.x ?? canvas.width / 2;
    this.y = params.y ?? canvas.height / 2;
    this.size = 20;
    this.speedX = params.speedX ?? 2
    this.speedY = params.speedY ?? -20
    this.lastTickMs = Date.now()
  }

  update() {

    const g = 1.5
    const tickMs = Date.now()
    const elapsed = tickMs - this.lastTickMs
    this.lastTickMs = Date.now()

    // Apply acceleration
    this.speedY += g * elapsed / 20;
    // Apply speed
    this.x += this.speedX * elapsed / 20;
    this.y += this.speedY * elapsed / 20;

    // Handle ground collision
    if (this.y + this.size >= this.canvas.height) {
      this.y = this.canvas.height - this.size;
      this.speedX *= 0.97;
      this.speedY *= -0.8;
    }

    // Handle left wall collision
    if (this.x < this.size) {
      this.x = this.size
      this.speedX *= -0.8;
    }

    // Handle right wall collision
    if (this.x + this.size > this.canvas.width) {
      this.x = this.canvas.width - this.size
      this.speedX *= -0.8;
    }
    // Stop ball when speed is too low
    if (Math.abs(this.speedX) < 0.2) {
      this.speedX = 0;
    }
  }

  draw() {

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error("Canvas context not found")

    // Background color
    ctx.fillStyle = '#007FFF';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill()

    // White reflection
    const grd1 = ctx.createRadialGradient(this.x - this.size * 0.5, this.y - this.size * 0.5, this.size * 0.5, this.x - this.size * 0.5, this.y - this.size * 0.5, 0);
    grd1.addColorStop(0, "rgba(255,255,255, 0)")
    grd1.addColorStop(1, "rgba(255,255,255, 0.4)")
    ctx.fillStyle = grd1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill()

    // Dark shadow
    const grd2 = ctx.createRadialGradient(this.x - this.size * 0.5, this.y - this.size * 0.5, this.size * 2, this.x - this.size * 0.5, this.y - this.size * 0.5, this.size * 0.5);
    grd2.addColorStop(0, "rgba(0,0,0, 0.5)")
    grd2.addColorStop(1, "rgba(0,0,0, 0)")
    ctx.fillStyle = grd2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill()

  }

}