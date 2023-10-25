let ballsArray = [];
let arrowsArray = [];
const mouse = { pos: {}, down: {}, isDown: {} }

const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


function onMove(touchId, x, y) { }

function onDown(touchId, x, y) {
  arrowsArray.push(new Arrow(mouse.down[touchId].x, mouse.down[touchId].y, touchId))
}

function onUp(touchId, x, y) {
  // Remove the arrow
  arrowsArray = arrowsArray.filter(arrow => arrow.touchId !== touchId)
  // Add a new ball
  ballsArray.push(new Ball({
    x: mouse.down[touchId].x,
    y: mouse.down[touchId].y,
    speedX: (x - mouse.down[touchId].x) / 5,
    speedY: (y - mouse.down[touchId].y) / 5,
  }));
}


function animate() {
  ctx.fillStyle = 'white';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawObjects([ballsArray, arrowsArray])
  requestAnimationFrame(animate);
}
animate();

function drawObjects(arrays) {
  for (const array of arrays) {
    for (let i = 0; i < array.length; i++) {
      array[i].update();
      array[i].draw();
    }
  }
}
