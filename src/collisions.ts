import Victor from "victor"
import Ball from "./Ball"

export function getNewSpeedsAfterCollision(ball1: Ball, ball2: Ball) {

  // From https://www.vobarian.com/collisions/2dcollisions2.pdf

  // 1. Find unit normal and unit tangent vectors.
  const normalVector = ball2.pos.clone().subtract(ball1.pos)
  const unitNormalVector = normalVector.clone().normalize()
  const unitTangeatVector = new Victor(-unitNormalVector.y, unitNormalVector.x)

  // 2. Create the initial (before the collision) velocity vectors, v1 and v2 => nothing to do (it's ball1.speed and ball2.speed)

  // 3. Instead of expressing speeds in terms of x and y components, we will now express them in terms of the normal and tangent vectors.
  const old_v1n = unitNormalVector.dot(ball1.speed)
  const old_v1t = unitTangeatVector.dot(ball1.speed)
  const old_v2n = unitNormalVector.dot(ball2.speed)
  const old_v2t = unitTangeatVector.dot(ball2.speed)

  // 4. Find the new tangential velocities (after the collision).
  // The tangential components of the velocity do not change after the collision because there is no force between the circles in the tangential direction during the collision.
  const v1t = old_v1t
  const v2t = old_v2t

  // 5. Find the magnitude of the new velocities (after the collision).
  const m1 = ball1.mass
  const m2 = ball2.mass
  const v1n_magnitude = (old_v1n * (m1 - m2) + 2 * m2 * old_v2n) / (m1 + m2)
  const v2n_magnitude = (old_v2n * (m2 - m1) + 2 * m1 * old_v1n) / (m1 + m2)

  // 6. Convert the scalar normal and tangential velocities into vectors.
  const v1n_vector = unitNormalVector.clone().multiplyScalar(v1n_magnitude)
  const v1t_vector = unitTangeatVector.clone().multiplyScalar(v1t)
  const v2n_vector = unitNormalVector.clone().multiplyScalar(v2n_magnitude)
  const v2t_vector = unitTangeatVector.clone().multiplyScalar(v2t)

  // 7. Find the final velocity vectors by adding the normal and tangential components for each object
  const v1 = v1n_vector.clone().add(v1t_vector)
  const v2 = v2n_vector.clone().add(v2t_vector)

  return [v1, v2]

}