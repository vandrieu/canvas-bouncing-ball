// import Ball from './'

import Arrow from "./Arrow";
import Ball from "./Ball";
import { setupMouseListeners } from "./mouseListeners";
import { DrawableObject, MouseState } from "./types";

let ballsArray: Ball[] = [];
let arrowsArray: Arrow[] = [];

const mouseState: MouseState = { pos: {}, down: {}, isDown: {} }

const canvas = document.querySelector('#canvas1') as HTMLCanvasElement;
if (!canvas) throw new Error("Canvas not found")
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
if (!ctx) throw new Error("Canvas context not found")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

setupMouseListeners(mouseState, canvas, onUp, onDown, onMove)

function onMove(touchId: number, x: number, y: number) { }

function onDown(touchId: number, x: number, y: number) {
  arrowsArray.push(new Arrow(canvas, mouseState, mouseState.down[touchId].x, mouseState.down[touchId].y, touchId))
}

function onUp(touchId: number, x: number, y: number) {
  // Remove the arrow
  arrowsArray = arrowsArray.filter(arrow => arrow.touchId !== touchId)
  // Add a new ball
  ballsArray.push(new Ball(
    canvas,
    {
      x: mouseState.down[touchId].x,
      y: mouseState.down[touchId].y,
      speedX: (x - mouseState.down[touchId].x) / 5,
      speedY: (y - mouseState.down[touchId].y) / 5,
    }
  ));
}


function animate() {
  ctx.fillStyle = 'white';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawObjects([ballsArray, arrowsArray])
  requestAnimationFrame(animate);
}
animate();

function drawObjects(arrays: DrawableObject[][]) {
  for (const array of arrays) {
    for (let i = 0; i < array.length; i++) {
      array[i].update();
      array[i].draw();
    }
  }
}
