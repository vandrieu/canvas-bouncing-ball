export type MouseState = {
  pos: { [key: number]: { x: number, y: number } },
  down: { [key: number]: { x: number, y: number } },
  isDown: { [key: number]: boolean },
}

export type DrawableObject = {
  update: Function,
  draw: Function,
}