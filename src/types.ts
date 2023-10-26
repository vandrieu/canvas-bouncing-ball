import Victor from "victor"

export type MouseState = {
  pos: { [key: number]: Victor },
  down: { [key: number]: Victor },
  isDown: { [key: number]: boolean },
}

export type DrawableObject = {
  update: Function,
  postUpdate?: Function,
  draw: Function,
}

export type MouseEventHandler = (touchId: number, downPosition: Victor) => any