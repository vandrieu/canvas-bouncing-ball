window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
})

// ----- TOUCH DOWN -----
canvas.addEventListener('mousedown', (e) => {
  if (e?.buttons === 1) { //left click only
    updateMouseState_onDown("mouse", e.x, e.y)
    onDown("mouse", e.x, e.y)
  }
})
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault(); // prevent duplicate mouseDown and mouseUp events on mobile
  [...e.changedTouches].forEach(touch => {
    updateMouseState_onDown(touch.identifier, touch.pageX, touch.pageY)
    onDown(touch.identifier, touch.pageX, touch.pageY)
  })
})

// ----- TOUCH MOVE -----
canvas.addEventListener('mousemove', (e) => {
  updateMouseState_onMove("mouse", e.x, e.y)
  onMove("mouse", e.x, e.y)
})
canvas.addEventListener('touchmove', (e) => {
  [...e.changedTouches].forEach(touch => {
    updateMouseState_onMove(touch.identifier, touch.pageX, touch.pageY)
    onMove(touch.identifier, touch.pageX, touch.pageY)
  })
})

// ----- TOUCH UP -----
canvas.addEventListener('mouseup', (e) => {
  if (e?.buttons === 0) { //left click only
    updateMouseState_onUp("mouse", e.x, e.y)
    onUp("mouse", e.x, e.y)
  }
})
canvas.addEventListener('touchend', (e) => {
  [...e.changedTouches].forEach(touch => {
    updateMouseState_onUp(touch.identifier, touch.pageX, touch.pageY)
    onUp(touch.identifier, touch.pageX, touch.pageY)
  })
})


// Update mouse state :

function updateMouseState_onMove(touchId, x, y) {
  if (!mouse.pos[touchId]) {
    mouse.pos[touchId] = {}
  }
  mouse.pos[touchId].x = x;
  mouse.pos[touchId].y = y;
}

function updateMouseState_onDown(touchId, x, y) {
  updateMouseState_onMove(touchId, x, y) // on mobile, if we start moving without having touched the screen, mouse.pos variables will not be initialized correctly
  mouse.isDown[touchId] = true;
  if (!mouse.down[touchId]) {
    mouse.down[touchId] = {}
  }
  mouse.down[touchId].x = x;
  mouse.down[touchId].y = y;
}

function updateMouseState_onUp(touchId, x, y) {
  mouse.isDown[touchId] = false;
}
