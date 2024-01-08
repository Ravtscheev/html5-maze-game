import {wallW, pathW, walls, holes, holeSize, end, endSize} from './map.js';

// Checks if a gyroscope is present
var gyroPresent = false;

var gameInProgress = false;
var previousTimestamp = undefined;
var accelerationX = undefined;
var accelerationY = undefined;
var frictionForceX = undefined;
var frictionForceY = undefined;
var ballStartColumn = 9;
var ballStartRow =  0;
const ballSize = 36; // Width and height of the ball
// The ball object
let balls = {};
var deathBlurElement = document.getElementById("death-screen");
const playButton = document.getElementById("play-button");

window.addEventListener("deviceorientation", function(event){
    if(event.alpha || event.beta || event.gamma) {
        gyroPresent = true;
    }
});

// checks if the 
window.addEventListener("deviceorientation", handleOrientation);
function handleOrientation(event) {
  accelerationX = calculateAccelerationForce(event.beta);
  accelerationY = - calculateAccelerationForce(event.gamma);
  frictionForceX = calculateFrictionForce(event.beta);
  frictionForceY = calculateFrictionForce(event.gamma);
}

// Function to stop the game and display the death screen
function stopGame(){
  gameInProgress = false;
  deathBlurElement.style.display = "";
  deathBlurElement.style.visibility = "visible";
}

// Function to win the game and display the win screen
function winGame(){
  gameInProgress = false;
  let winBlurElement = document.getElementById("win-screen");
  winBlurElement.style.display = "";
  winBlurElement.style.visibility = "visible";

}

// Resets the game to the initial state
function resetGame() {
  previousTimestamp = undefined;
  gameInProgress = false;
  accelerationX = undefined;
  accelerationY = undefined;
  frictionForceX = undefined;
  frictionForceY = undefined;
}

// Fuction to ensure that the value is between the min and max limits
Math.minmax = (value, limit) => {
  return Math.max(Math.min(value, limit), -limit);
};

// Calculates the acceleration force
function calculateAccelerationForce(planeAngle){
  // radians = degrees * (pi/180)
  const angleInRadians = planeAngle * (Math.PI / 180);
  // gravitational acceleration in m/s^2
  const gravitationalAcceleration = 9.81; 
  return gravitationalAcceleration * (Math.sin(angleInRadians));
}

// Calculates the friction force
function calculateFrictionForce(planeAngle){
  // gravitational acceleration in m/s^2
  const gravitationalAcceleration = 9.81; 
  // Coefficients of friction
  const frictionCoefficient = 0.01;
  // radians = degrees * (pi/180)
  const angleInRadians = planeAngle * (Math.PI / 180);
  return gravitationalAcceleration * (Math.cos(angleInRadians)) * frictionCoefficient;
}

// This function calculates the change in velocity
function calculateVelocityDelta(acceleration, timeDelta){
  return acceleration * timeDelta;
}

// This function calculates the change in friction
function calculateFrictionDelta(friction, timeDelta){
  return friction * timeDelta;
}

// This function slows down the ball (ball can only slow down, not reverse movement)
const slowDown = (number, difference) => {
  if (Math.abs(number) <= difference) return 0;
  if (number > difference) return number - difference;
  return number + difference;
};

//handle permission for device motion for iOS
function askPermission(){
  if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      DeviceMotionEvent.requestPermission();
    }
}

playButton.addEventListener("click", function(event) {
  if (!gameInProgress && gyroPresent) {
    gameInProgress = true;
    let startBlurElement = document.getElementById("start-screen");
    fadeOutEffect(startBlurElement);
    startBlurElement.style.display = "none";
    window.requestAnimationFrame(main);
    askPermission();
    createBall();
  } else if (!gyroPresent) {
    alert("Dein Gerät hat keinen Gyroskop-Sensor oder dein Browser unterstützt diesen nicht.");
  }
});

const replayButton = document.getElementById("replay-button");
replayButton.addEventListener("click", function(event) {
    resetGame();
    deleteBall();
    askPermission();
    createBall();
    deathBlurElement.style.display = "none";
    gameInProgress = true;
    window.requestAnimationFrame(main);
    
});


// Fade out effect for the start screen
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

// Creates the ball at the start position
function createBall(){
  balls = {
    x: ballStartColumn * (wallW + pathW) + (wallW / 2 + pathW / 2),
    y: ballStartRow * (wallW + pathW) + (wallW / 2 + pathW / 2) + 20,
    velocityX: 0,
    velocityY: 0
  };
  const ball = document.createElement("div");
  ball.setAttribute("id", "ball");
  ball.style.cssText = `left: ${balls.x}px; top: ${balls.y}px; width: ${ballSize}px; height: ${ballSize}px;`;
  document.getElementById("maze").appendChild(ball);
}

function deleteBall(){
  const element = document.getElementById("ball");
  element.remove();
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

  const maxVelocity = 6;

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
          // Horizontal wall
          handleHorizontalWallCollision(wall, wallStart, wallEnd);
          }
        } else {
          if (
            balls.nextX + ballSize / 2 >= wall.x - wallW / 2 &&
            balls.nextX - ballSize / 2 <= wall.x + wallW / 2
          ) {
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
        stopGame();
      }
    });

    balls.x = balls.x + balls.velocityX;
    balls.y = balls.y + balls.velocityY;

    // console.log(balls.x, balls.y);
    document.getElementById('ball').style.cssText = `left: ${balls.x}px; top: ${balls.y}px; width: ${ballSize}px; height: ${ballSize}px;`;
  }

  //Allows the game to loop through the main function
  const winDistance = distance2D(end, {
    x: balls.nextX,
    y: balls.nextY
  });
  
  if (winDistance <= endSize / 6) {
    winGame();
    gameInProgress = false;
  } else if (gameInProgress) {
    previousTimestamp = timestamp;
    window.requestAnimationFrame(main);
  }
}