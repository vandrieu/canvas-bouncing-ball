import Victor from "victor"
import { DrawableObject } from "./types"
import { getNewSpeedsAfterCollision } from "./collisions"
import { randomInt } from "./utils"

type BallInitParams = {
  pos?: Victor
  speed?: Victor
}

export default class Ball implements DrawableObject {

  canvas: HTMLCanvasElement
  balls: Ball[]
  acceleration: Victor
  speed: Victor
  pos: Victor
  radius: number
  lastTickMs: number
  mass: number

  static MAX_BALLS = 6
  static ACCELERATION = new Victor(0, 1.2)
  static FRICTION_ENERGY_LOSS = 0.98
  static WALL_COLLISION_ENERGY_LOSS = 0.8
  static BALL_COLLISION_ENERGY_LOSS = 0.95

  constructor(canvas: HTMLCanvasElement, balls: Ball[], params: BallInitParams = {}) {
    this.canvas = canvas;
    this.balls = balls;
    this.acceleration = Ball.ACCELERATION
    this.speed = params.speed ?? new Victor(2, -20)
    this.pos = params.pos ?? new Victor(canvas.width / 2, canvas.height / 2)
    this.radius = randomInt(30, canvas.width / (Ball.MAX_BALLS * 4 / 3) / 2)
    this.lastTickMs = Date.now()
    this.mass = this.radius * this.radius * this.radius
    document.querySelector('#onboarding')?.remove();
    (document.querySelector('#removeBallsContainer') as HTMLElement).style.display = 'block';
  }

  update() {

    const tickMs = Date.now()
    const elapsed = tickMs - this.lastTickMs
    this.lastTickMs = Date.now()

    // add acceleration to speed
    this.speed.add(this.acceleration.clone().multiplyScalar(elapsed / 20))

    // Apply speed
    this.pos.add(this.speed.clone().multiplyScalar(elapsed / 20))

    // Handle ground collision
    if (this.pos.y + this.radius >= this.canvas.height) {
      this.pos.y = this.canvas.height - this.radius;
      this.speed.x *= Ball.FRICTION_ENERGY_LOSS;
      this.speed.y *= -1;
      this.speed.y *= Ball.WALL_COLLISION_ENERGY_LOSS;
    }

    // Handle left wall collision
    if (this.pos.x < this.radius) {
      this.pos.x = this.radius
      this.speed.x *= -1;
      this.speed.x *= Ball.WALL_COLLISION_ENERGY_LOSS;
    }

    // Handle right wall collision
    if (this.pos.x + this.radius > this.canvas.width) {
      this.pos.x = this.canvas.width - this.radius
      this.speed.x *= -1;
      this.speed.x *= Ball.WALL_COLLISION_ENERGY_LOSS;
    }

  }

  postUpdate() {

    //Handle ball collisions

    const otherBalls = this.balls.filter(b => b !== this)
    for (const ball of otherBalls) {

      const distance = this.pos.distance(ball.pos)
      if (distance < this.radius + ball.radius) {

        // Collision detected !

        // 1. Update balls speed
        const angle = Math.atan2(ball.pos.y - this.pos.y, ball.pos.x - this.pos.x)
        const [speed1, speed2] = getNewSpeedsAfterCollision(this, ball)
        this.speed = speed1
        ball.speed = speed2

        // 2. Collisions absorbs some energy
        this.speed.multiplyScalar(Ball.BALL_COLLISION_ENERGY_LOSS)
        ball.speed.multiplyScalar(Ball.BALL_COLLISION_ENERGY_LOSS)

        // 3. Update balls position to avoid overlap
        const overlap = this.radius + ball.radius - distance
        this.pos.x -= ((overlap) * Math.cos(angle))
        this.pos.y -= ((overlap) * Math.sin(angle))

        // 4. Stop ball when speed is too low
        if (Math.abs(this.speed.x) < 0.2) {
          this.speed.x = 0;
        }
      }
    }
  }

  draw() {

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error("Canvas context not found")

    // Background color
    ctx.fillStyle = '#007FFF';
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fill()

    // White reflection
    const grd1 = ctx.createRadialGradient(this.pos.x - this.radius * 0.5, this.pos.y - this.radius * 0.5, this.radius * 0.5, this.pos.x - this.radius * 0.5, this.pos.y - this.radius * 0.5, 0);
    grd1.addColorStop(0, "rgba(255,255,255, 0)")
    grd1.addColorStop(1, "rgba(255,255,255, 0.4)")
    ctx.fillStyle = grd1;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fill()

    // Dark shadow
    const grd2 = ctx.createRadialGradient(this.pos.x - this.radius * 0.5, this.pos.y - this.radius * 0.5, this.radius * 2, this.pos.x - this.radius * 0.5, this.pos.y - this.radius * 0.5, this.radius * 0.5);
    grd2.addColorStop(0, "rgba(0,0,0, 0.5)")
    grd2.addColorStop(1, "rgba(0,0,0, 0)")
    ctx.fillStyle = grd2;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fill()

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
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(to.x - headSize * Math.cos(angle - Math.PI / 7), to.y - headSize * Math.sin(angle - Math.PI / 7));
    ctx.lineTo(to.x - headSize * Math.cos(angle + Math.PI / 7), to.y - headSize * Math.sin(angle + Math.PI / 7));
    ctx.lineTo(to.x, to.y);
    ctx.lineTo(to.x - headSize * Math.cos(angle - Math.PI / 7), to.y - headSize * Math.sin(angle - Math.PI / 7));
    ctx.lineWidth = bodySize;
    // ctx.stroke();
    ctx.fill();
    ctx.restore();
  }

}
