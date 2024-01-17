import { player } from "./main.ts";


/*export {playCollisionSound}

const audioSourceUrl = "/src/boing_lmke36X.mp3";

const collisionSound = new Audio(audioSourceUrl);


function playCollisionSound() {
  collisionSound.currentTime = 0; // Restart the sound if already playing
  collisionSound.play();

}*/



export type Vector2 = {
  x: number,
  y: number
};

export type Circle = Vector2 & {
  radius: number
};

export type CircleBody = Circle & {
  vx: number,
  vy: number
};

export function distance(a: Vector2, b: Vector2): number {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

export function circleOverlap(a: Circle, b: Circle): boolean {
  return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) <= (a.radius + b.radius) * (a.radius + b.radius);
}

export function handleRectangleCircleCollision(rect: player, circle: CircleBody): void {
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
  const distanceX = circle.x - closestX;
  const distanceY = circle.y - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  if (distanceSquared < circle.radius * circle.radius) {
    // Collision detected, adjust circle's velocity
    const distance = Math.sqrt(distanceSquared);
    const overlap = circle.radius - distance;

    // Move the circle outside the rectangle by the overlap amount
    circle.x += overlap * (circle.x - closestX) / distance;
    circle.y += overlap * (circle.y - closestY) / distance;

    // Reflect the circle's velocity based on the collision normal
    const normalX = distanceX / distance;
    const normalY = distanceY / distance;
    const dotProduct = (circle.vx * normalX + circle.vy * normalY) * 2;
    circle.vx -= dotProduct * normalX;
    circle.vy -= dotProduct * normalY;
   

  }
}

export function handleCollision(a: CircleBody, b: CircleBody): void {
  // Handle collision between circles
  if (circleOverlap(a, b)) {
    //playCollisionSound();

  }
  
}
