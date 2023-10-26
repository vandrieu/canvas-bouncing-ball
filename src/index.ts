import Victor from "victor";
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

function onMove(touchId: number, position: Victor) { }

function onDown(touchId: number, downPosition: Victor) {
  arrowsArray.push(new Arrow(canvas, mouseState, mouseState.down[touchId], touchId))
}

function onUp(touchId: number, upPosition: Victor) {
  const downPosition = mouseState.down[touchId]
  // Remove the arrow
  arrowsArray = arrowsArray.filter(arrow => arrow.touchId !== touchId)
  // Add a new ball
  ballsArray.push(new Ball(
    canvas,
    ballsArray,
    {
      pos: downPosition,
      speed: upPosition.clone().subtract(downPosition).clone().divideScalar(5),
    }
  ));
  // Remove the oldest ball if there are too many
  if (ballsArray.length > Ball.MAX_BALLS) {
    ballsArray.shift()
  }
}

document.querySelector('#removeBallsBtn')?.addEventListener('click', () => {
  ballsArray = []
})

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
      const drawableObject = array[i]
      drawableObject.update();
      if (drawableObject.postUpdate !== undefined) {
        drawableObject.postUpdate()
      }
      drawableObject.draw();
    }
  }
}
