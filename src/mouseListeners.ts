import { MouseState } from "./types";

const DUMMY_MOUSE_TOUCH_ID = 9999

export function setupMouseListeners(mouseState: MouseState, canvas: HTMLCanvasElement, onUp: Function, onDown: Function, onMove: Function) {

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  })

  // ----- TOUCH DOWN -----
  canvas.addEventListener('mousedown', (e) => {
    if (e?.buttons === 1) { //left click only
      updateMouseState_onDown(mouseState, DUMMY_MOUSE_TOUCH_ID, e.x, e.y)
      onDown(DUMMY_MOUSE_TOUCH_ID, e.x, e.y)
    }
  })
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // prevent duplicate mouseDown and mouseUp events on mobile
    [...e.changedTouches].forEach(touch => {
      updateMouseState_onDown(mouseState, touch.identifier, touch.pageX, touch.pageY)
      onDown(touch.identifier, touch.pageX, touch.pageY)
    })
  })

  // ----- TOUCH MOVE -----
  canvas.addEventListener('mousemove', (e) => {
    updateMouseState_onMove(mouseState, DUMMY_MOUSE_TOUCH_ID, e.x, e.y)
    onMove(DUMMY_MOUSE_TOUCH_ID, e.x, e.y)
  })
  canvas.addEventListener('touchmove', (e) => {
    [...e.changedTouches].forEach(touch => {
      updateMouseState_onMove(mouseState, touch.identifier, touch.pageX, touch.pageY)
      onMove(touch.identifier, touch.pageX, touch.pageY)
    })
  })

  // ----- TOUCH UP -----
  canvas.addEventListener('mouseup', (e) => {
    if (e?.buttons === 0) { //left click only
      updateMouseState_onUp(mouseState, DUMMY_MOUSE_TOUCH_ID, e.x, e.y)
      onUp(DUMMY_MOUSE_TOUCH_ID, e.x, e.y)
    }
  })
  canvas.addEventListener('touchend', (e) => {
    [...e.changedTouches].forEach(touch => {
      updateMouseState_onUp(mouseState, touch.identifier, touch.pageX, touch.pageY)
      onUp(touch.identifier, touch.pageX, touch.pageY)
    })
  })
}



// Update mouse state :

function updateMouseState_onMove(mouseState: MouseState, touchId: number, x: number, y: number) {
  mouseState.pos[touchId] = { x, y }
}

function updateMouseState_onDown(mouseState: MouseState, touchId: number, x: number, y: number) {
  updateMouseState_onMove(mouseState, touchId, x, y) // on mobile, if we start moving without having touched the screen, mouseState.pos variables will not be initialized correctly
  mouseState.isDown[touchId] = true;
  mouseState.down[touchId] = { x, y }
}

function updateMouseState_onUp(mouseState: MouseState, touchId: number, x: number, y: number) {
  mouseState.isDown[touchId] = false;
}
