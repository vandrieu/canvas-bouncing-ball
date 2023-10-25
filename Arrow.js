class Arrow {
  constructor(fromX, fromY, touchId) {
    this.fromX = fromX
    this.fromY = fromY
    this.touchId = touchId
  }
  update() {
    this.toX = mouse.pos[this.touchId].x
    this.toY = mouse.pos[this.touchId].y
  }
  draw() {
    this.drawArrow(this.fromX, this.fromY, this.toX, this.toY)
  }
  drawArrow(fromx, fromy, tox, toy) {
    const arrowLength = Math.sqrt((fromx - tox) ** 2 + (fromy - toy) ** 2);
    const bodySize = Math.min(50, arrowLength / 10)
    const headSize = bodySize * 2;
    const angle = Math.atan2(toy - fromy, tox - fromx);

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