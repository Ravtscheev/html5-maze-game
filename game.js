import {wallW, pathW, walls, holes, holeSize, end, endSize} from './map.js';

// Checks if a gyroscope is present
var maxVelocity = 50;
var gyroPresent = false;
var gameInProgress = false;
var previousTimestamp = undefined;
let mouseStartX = undefined;
let mouseStartY = undefined;
var accelerationX = undefined;
var accelerationY = undefined;
var frictionForceX = undefined;
var frictionForceY = undefined;
var setter = false;
const ballSize = 36; // Width and height of the ball
let balls = {
  column: 9,
  row: 0
};

window.addEventListener("deviceorientation", function(event){
    if(event.alpha || event.beta || event.gamma) {
        gyroPresent = true;
        // document.getElementById('gyroPresent').innerHTML = true;
        // alert("Dein Gerät unterstützt kein Gyroskop.");
    }
});

window.addEventListener("deviceorientation", handleOrientation);
function handleOrientation(event) {
  accelerationX = calculateAccelerationForce(event.beta);
  accelerationY = - calculateAccelerationForce(event.gamma);
  frictionForceX = calculateFrictionForce(event.beta);
  frictionForceY = calculateFrictionForce(event.gamma);

  // updateFieldIfNotNull('Orientation_a', event.alpha);
  // updateFieldIfNotNull('Orientation_b', event.beta);
  // updateFieldIfNotNull('Orientation_g', event.gamma);
  // updateFieldIfNotNull('acceleration_X', accelerationX);
  // updateFieldIfNotNull('acceleration_Y', accelerationY);
  // updateFieldIfNotNull('friction_X', frictionForceX);
  // updateFieldIfNotNull('friction_Y', frictionForceY);
  // incrementEventCount();
}

function incrementEventCount(){
  let counterElement = document.getElementById("num-observed-events")
  let eventCount = parseInt(counterElement.innerHTML)
  counterElement.innerHTML = eventCount + 1;
}

function updateFieldIfNotNull(fieldName, value, precision=2){
  if (value != null)
    document.getElementById(fieldName).innerHTML = value.toFixed(precision);
}

Math.minmax = (value, limit) => {
  return Math.max(Math.min(value, limit), -limit);
};

function calculateAccelerationForce(planeAngle){
  const angleInRadians = planeAngle * (Math.PI / 180);
  const gravitationalAcceleration = 9.81; // gravitational acceleration in m/s^2

  return gravitationalAcceleration * (Math.sin(angleInRadians));
}

function calculateFrictionForce(planeAngle){
  const gravitationalAcceleration = 9.81; // gravitational acceleration in m/s^2
  const frictionCoefficient = 0.006; // Coefficients of friction
  const angleInRadians = planeAngle * (Math.PI / 180);

  return gravitationalAcceleration * (Math.cos(angleInRadians)) * frictionCoefficient;
}

function calculateVelocityDelta(acceleration, timeDelta){
  return acceleration * timeDelta;
}

function calculateFrictionDelta(friction, timeDelta){
  return friction * timeDelta;
}

function calculateVelocity(velocity, velocityDelta, frictionDelta){
  return 
}

const slowDown = (number, difference) => {
  if (Math.abs(number) <= difference) return 0;
  if (number > difference) return number - difference;
  return number + difference;
};

const playButton = document.getElementById("play-button");
playButton.addEventListener("click", function(event) {
  if (!gameInProgress) {
    gameInProgress = true;
    let blurElement = document.getElementById("blur-element");
    fadeOutEffect(blurElement);
    window.requestAnimationFrame(main);
    // noteElement.style.opacity = 0;
    console.log("Play");
    createBall();
  } else {
    gameInProgress = false;
    console.log("Pause");
  }
});

function fadeOutEffect(fadeTarget) {
  var fadeEffect = setInterval(function () {
      if (!fadeTarget.style.opacity) {
          fadeTarget.style.opacity = 1;
      }
      if (fadeTarget.style.opacity > 0) {
          fadeTarget.style.opacity -= 0.1;
      } else {
          clearInterval(fadeEffect);
      }
  }, 20);
}

function createBall(){
  balls = {
    x: balls.column * (wallW + pathW) + (wallW / 2 + pathW / 2) + 780,
    y: balls.row * (wallW + pathW) + (wallW / 2 + pathW / 2) + 20,
    velocityX: 0,
    velocityY: 0
  };
  const ball = document.createElement("div");
  ball.setAttribute("class", "ball");
  ball.style.cssText = `left: ${balls.x}px; top: ${balls.y}px; width: ${ballSize}px; height: ${ballSize}px;`;
  document.getElementById("maze").appendChild(ball);
}

function handleHorizontalWallCollision(wall, wallStart, wallEnd) {
  const isBallToLeftCap = balls.nextX + ballSize / 2 >= wallStart.x - wallW / 2 && balls.nextX < wallStart.x;
  const isBallToRightCap = balls.nextX - ballSize / 2 <= wallEnd.x + wallW / 2 && balls.nextX > wallEnd.x;

  handleCapCollision(isBallToLeftCap, wallStart);
  handleCapCollision(isBallToRightCap, wallEnd);

  if (balls.nextX >= wallStart.x && balls.nextX <= wallEnd.x) {
    handleInsideWallCollision(wall);
  }
}

function handleVerticalWallCollision(wall, wallStart, wallEnd) {
  const isBallToTopCap = balls.nextY + ballSize / 2 >= wallStart.y - wallW / 2 && balls.nextY < wallStart.y;
  const isBallToBottomCap = balls.nextY - ballSize / 2 <= wallEnd.y + wallW / 2 && balls.nextY > wallEnd.y;

  handleCapCollision(isBallToTopCap, wallStart);
  handleCapCollision(isBallToBottomCap, wallEnd);
  if (balls.nextY >= wallStart.y && balls.nextY <= wallEnd.y) {
    handleInsideWallCollision(wall);
  }
}

function handleCapCollision(condition, capPosition) {
  if (condition) {
    const distance = distance2D(capPosition, { x: balls.nextX, y: balls.nextY });
    if (distance < ballSize / 2 + wallW / 2) {
      const closest = closestItCanBe(capPosition, { x: balls.nextX, y: balls.nextY });
      const rolled = rollAroundCap(capPosition, {
        x: closest.x,
        y: closest.y,
        velocityX: balls.velocityX,
        velocityY: balls.velocityY,
      });

      Object.assign(balls, rolled);
    }
  }
}

const distance2D = (p1, p2) => {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
};

// Angle between the two points
const getAngle = (p1, p2) => {
  let angle = Math.atan((p2.y - p1.y) / (p2.x - p1.x));
  if (p2.x - p1.x < 0) angle += Math.PI;
  return angle;
};

// The closest a ball and a wall cap can be
const closestItCanBe = (cap, ball) => {
  let angle = getAngle(cap, ball);

  const deltaX = Math.cos(angle) * (wallW / 2 + ballSize / 2);
  const deltaY = Math.sin(angle) * (wallW / 2 + ballSize / 2);

  return { x: cap.x + deltaX, y: cap.y + deltaY };
};

// Roll the ball around the wall cap
const rollAroundCap = (cap, ball) => {
  // The direction the ball can't move any further because the wall holds it back
  let impactAngle = getAngle(ball, cap);

  // The direction the ball wants to move based on it's velocity
  let heading = getAngle(
    { x: 0, y: 0 },
    { x: ball.velocityX, y: ball.velocityY }
  );
}


function handleInsideWallCollision(wall) {
  if (wall.horizontal) {
    // Horizontal wall
    if (balls.nextY < wall.y) {
      // Hit horizontal wall from top
      balls.nextY = wall.y - wallW / 2 - ballSize / 2;
    } else {
      // Hit horizontal wall from bottom
      balls.nextY = wall.y + wallW / 2 + ballSize / 2;
    }
    balls.y = balls.nextY;
    balls.velocityY = -balls.velocityY / 3;
  } else {
    // Vertical wall
    if (balls.nextX < wall.x) {
      // Hit vertical wall from left
      balls.nextX = wall.x - wallW / 2 - ballSize / 2;
    } else {
      // Hit vertical wall from right
      balls.nextX = wall.x + wallW / 2 + ballSize / 2;
    }
    balls.x = balls.nextX;
    balls.velocityX = -balls.velocityX / 3;
  }
}


// Main game loop
function main(timestamp) {
  // It is possible to reset the game mid-game. This case the look should stop
  if (!gameInProgress) return;
  
  // Checks if the previous timestamp is undefined, if so, set it to the current time
  if (previousTimestamp === undefined) {
    previousTimestamp = timestamp;
    window.requestAnimationFrame(main);
    return;
  }

  const maxVelocity = 5;

  // Time passed since last cycle divided by 16
  // This function gets called every 16 ms on average so dividing by 16 will result in 1
  const timeDelta = (timestamp - previousTimestamp) / 16;
  

  if (accelerationX != undefined && accelerationY != undefined) {
    const velocityDeltaX = calculateVelocityDelta(accelerationX,timeDelta);
    const velocityDeltaY = calculateVelocityDelta(accelerationY, timeDelta);
    const frictionDeltaX = calculateFrictionDelta(frictionForceX, timeDelta);
    const frictionDeltaY = calculateFrictionDelta(frictionForceY, timeDelta);

    if (velocityDeltaX == 0) {
      // No rotation, the plane is flat
      // On flat surface friction can only slow down, but not reverse movement
      balls.velocityX = slowDown(balls.velocityX, frictionDeltaX);
    } else {
      balls.velocityX = balls.velocityX + velocityDeltaX;
      balls.velocityX = Math.max(Math.min(balls.velocityX, 1.5), -1.5);
      balls.velocityX = balls.velocityX - Math.sign(velocityDeltaX) * frictionDeltaX;
      balls.velocityX = Math.minmax(balls.velocityX, maxVelocity);
    }

    if (velocityDeltaY == 0) {
      // No rotation, the plane is flat
      // On flat surface friction can only slow down, but not reverse movement
      balls.velocityY = slowDown(balls.velocityY, frictionDeltaY);
    } else {
      balls.velocityY = balls.velocityY + velocityDeltaY;
      balls.velocityY = balls.velocityY - Math.sign(velocityDeltaY) * frictionDeltaY;
      balls.velocityY = Math.minmax(balls.velocityY, maxVelocity);
    }

    balls.nextX = balls.x + balls.velocityX;
    balls.nextY = balls.y + balls.velocityY;
    
    function BallStrip(axis, start, end){
    return axis + ballSize / 2 >= start - wallW / 2 && axis - ballSize / 2 <= end + wallW / 2;
  }

  // updateFieldIfNotNull('ball-x', balls.x);
  // updateFieldIfNotNull('ball-y', balls.x);


    walls.forEach((wall, wi) => {
      const isHorizontal = wall.horizontal;
      const isBallInStrip = (axis, start, end) =>
        axis + ballSize / 2 >= start - wallW / 2 && axis - ballSize / 2 <= end + wallW / 2;
    
      const wallStart = isHorizontal ? { x: wall.x, y: wall.y } : { x: wall.x, y: wall.y };
      const wallEnd = isHorizontal ? { x: wall.x + wall.length, y: wall.y } : { x: wall.x, y: wall.y + wall.length };
        if (isHorizontal) {
          if (
            balls.nextY + ballSize / 2 >= wall.y - wallW / 2 &&
            balls.nextY - ballSize / 2 <= wall.y + wallW / 2
          ) {
          console.log("Horizontal wall");
          // Horizontal wall
          handleHorizontalWallCollision(wall, wallStart, wallEnd);
          }
        } else {
          if (
            balls.nextX + ballSize / 2 >= wall.x - wallW / 2 &&
            balls.nextX - ballSize / 2 <= wall.x + wallW / 2
          ) {
          console.log("Vertical wall");
          // Vertical wall
          handleVerticalWallCollision(wall, wallStart, wallEnd);
        }
        }
    });

    holes.forEach((hole, hi) => {
      const distance = distance2D(hole, {
        x: balls.nextX,
        y: balls.nextY
      });

      if (distance <= holeSize / 2) {
        // The ball fell into a hole
        throw Error("The ball fell into a hole");
      }
    });

    balls.x = balls.x + balls.velocityX;
    balls.y = balls.y + balls.velocityY;

    // console.log(balls.x, balls.y);
    document.getElementsByClassName('ball')[0].style.cssText = `left: ${balls.x}px; top: ${balls.y}px; width: ${ballSize}px; height: ${ballSize}px;`;
  }

  //Allows the game to loop through the main function
  const winDistance = distance2D(end, {
    x: balls.nextX,
    y: balls.nextY
  });
  
  if (winDistance <= endSize / 6) {
    //noteElement.innerHTML = `Congrats, you did it!`;
    //noteElement.style.opacity = 1;
    gameInProgress = false;
  } else {
    previousTimestamp = timestamp;
    window.requestAnimationFrame(main);
  }
}