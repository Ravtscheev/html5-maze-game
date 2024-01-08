// Description: This file contains the map of the game. It is used to draw the walls and holes of the game.

// Constants
export const pathW = 25; // Path width
export const wallW = 15; // Wall width
export const holeSize = 50; // Hole size
export const endSize = 50; // End size
const mazeElement = document.getElementById("maze");

// Defines the walls of the maze
// Each wall is defined by its starting column and row, its orientation (horizontal or vertical) and its length
export const walls = [
    // Border
    { column: 0, row: 0, horizontal: true, length: 30 },
    { column: 0, row: 0, horizontal: false, length: 18 },
    { column: 0, row: 18, horizontal: true, length: 30 },
    { column: 30, row: 0, horizontal: false, length: 18 },
    
    // Horizontal lines starting in 1. column
    { column: 0, row: 2, horizontal: true, length: 1 },
    { column: 0, row: 5, horizontal: true, length: 2 },

    // Horizontal lines starting in 2. column
    { column: 2, row: 8, horizontal: true, length: 2},
    { column: 2, row: 13, horizontal: true, length: 2},

    // Horizontal lines starting in 5. column
    { column: 6, row: 2, horizontal: true, length: 8},
    { column: 6, row: 6, horizontal: true, length: 2},
    { column: 6, row: 13, horizontal: true, length: 2},

    // Horizontal lines starting in 8. column
    { column: 8, row: 9, horizontal: true, length: 2},

    // Horizontal lines starting in 10. column
    { column: 10, row: 7, horizontal: true, length: 2},
    { column: 10, row: 14, horizontal: true, length: 5},

    // Horizontal lines starting in 14. column
    { column: 14, row: 3, horizontal: true, length: 2},
    { column: 14, row: 3, horizontal: true, length: 2},
    { column: 14, row: 6, horizontal: true, length: 3},
    { column: 14, row: 10, horizontal: true, length: 1},

    // Horizontal lines starting in 16. column
    { column: 16, row: 12, horizontal: true, length: 1},

    // Horizontal lines starting in 17. column
    { column: 17, row: 10, horizontal: true, length: 1},
    { column: 17, row: 14, horizontal: true, length: 2},

    // Horizontal lines starting in 18. column
    { column: 18, row: 4, horizontal: true, length: 1},

    // Horizontal lines starting in 19. column
    { column: 19, row: 5, horizontal: true, length: 1},

    // Horizontal lines starting in 21. column
    { column: 21, row: 12, horizontal: true, length: 1},
    { column: 21, row: 15, horizontal: true, length: 2},

    // Horizontal lines starting in 22. column
    { column: 22, row: 8, horizontal: true, length: 1},
    { column: 22, row: 13, horizontal: true, length: 1},

    { column: 24, row: 4, horizontal: true, length: 4},
    // Horizontal lines starting in 28. column
    { column: 28, row: 11, horizontal: true, length: 2},
  
    //--------------------------------------------------
    // Vertical lines starting in 2. column  
    { column: 2, row: 10, horizontal: false, length: 1},

    // Vertical lines starting in 3. column
    { column: 3, row: 2, horizontal: false, length: 1},

    // Vertical lines starting in 4. column
    { column: 4, row: 0, horizontal: false, length: 1},
    { column: 4, row: 4, horizontal: false, length: 4},
    { column: 4, row: 10, horizontal: false, length: 1},
    { column: 4, row: 13, horizontal: false, length: 3},

    // Vertical lines starting in 6. column
    { column: 6, row: 2, horizontal: false, length: 1},
    { column: 6, row: 5, horizontal: false, length: 8},
    { column: 6, row: 15, horizontal: false, length: 3},

    // Vertical lines starting in 8. column
    { column: 8, row: 4, horizontal: false, length: 3},

    // Vertical lines starting in 10. column
    { column: 10, row: 2, horizontal: false, length: 3},
    { column: 10, row: 7, horizontal: false, length: 8},

    // Vertical lines starting in 14. column
    { column: 14, row: 0, horizontal: false, length: 10},

    // Vertical lines starting in 17. column
    { column: 17, row: 8, horizontal: false, length: 10},

    // Vertical lines starting in 19. column
    { column: 19, row: 0, horizontal: false, length: 1},
    { column: 19, row: 3, horizontal: false, length: 5},

    // Vertical lines starting in 21. column
    { column: 21, row: 15, horizontal: false, length: 1},

    // Vertical lines starting in 22. column
    { column: 22, row: 0, horizontal: false, length: 13},

    { column: 25, row: 7, horizontal: false, length: 2},

    // Vertical lines starting in 26. column
    { column: 26, row: 0, horizontal: false, length: 1},
    { column: 26, row: 3, horizontal: false, length: 2},
    { column: 26, row: 11, horizontal: false, length: 3},
    { column: 26, row: 16, horizontal: false, length: 2},

    // Vertical lines starting in 28. column
    { column: 28, row: 0, horizontal: false, length: 1},
    { column: 28, row: 3, horizontal: false, length: 2},
    { column: 28, row: 7, horizontal: false, length: 4},
    { column: 28, row: 14, horizontal: false, length: 2},
  ].map((wall) => ({
    x: wall.column * (pathW + wallW),
    y: wall.row * (pathW + wallW),
    horizontal: wall.horizontal,
    length: wall.length * (pathW + wallW)
  }));
  
  // Draw the walls on the screen using the wall metadata defined above
  walls.forEach(({ x, y, horizontal, length }) => {
    const wall = document.createElement("div");;
    wall.setAttribute("class", "wall");
    wall.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${wallW}px;
        height: ${length}px;
        transform: rotate(${horizontal ? -90 : 0}deg);
      `;
    mazeElement.appendChild(wall);
  });

  // Defines the holes of the maze (black holes)
  // Each hole is defined by its column and row and its offset from the top left corner of the cell
export const holes = [
    { column: 0, row: 0, leftOffset: 0, topOffset: 0},
    { column: 0, row: 3, leftOffset: 0, topOffset: 8},
    { column: 0, row: 10, leftOffset: 0, topOffset: 0},
    { column: 0, row: 16, leftOffset: 0, topOffset: 0},

    { column: 2, row: 6, leftOffset: 0, topOffset: 0},
    { column: 2, row: 13, leftOffset: 0, topOffset: 0},
    { column: 2, row: 13, leftOffset: 0, topOffset: 0},

    { column: 3, row: 8, leftOffset: 0, topOffset: 0},
    { column: 3, row: 11, leftOffset: 0, topOffset: 0},
    
    { column: 4, row: 2, leftOffset: 0, topOffset: 0},

    { column: 6, row: 6, leftOffset: 0, topOffset: 0},
    { column: 6, row: 11, leftOffset: 0, topOffset: 0},
    { column: 6, row: 13, leftOffset: 0, topOffset: 0},

    { column: 8, row: 15, leftOffset: 0, topOffset: 0},

    { column: 10, row: 2, leftOffset: 0, topOffset: 0},
    { column: 10, row: 12, leftOffset: 0, topOffset: 0},

    { column: 11, row: 5, leftOffset: 0, topOffset: 0},

    { column: 12, row: 9, leftOffset: 0, topOffset: 0},

    { column: 13, row: 12, leftOffset: 0, topOffset: 0},

    { column: 14, row: 0, leftOffset: 0, topOffset: 0},
    { column: 14, row: 4, leftOffset: 0, topOffset: 0},
    { column: 14, row: 6, leftOffset: 0, topOffset: 0},

    { column: 15, row: 16, leftOffset: 0, topOffset: 0},

    { column: 17, row: 2, leftOffset: 0, topOffset: 0},
    { column: 17, row: 8, leftOffset: 0, topOffset: 0},
    { column: 17, row: 14, leftOffset: 0, topOffset: 0},

    { column: 18, row: 16, leftOffset: 0, topOffset: 0},

    { column: 19, row: 3, leftOffset: 0, topOffset: 0},
    { column: 19, row: 11, leftOffset: 0, topOffset: 0},

    { column: 20, row: 0, leftOffset: 0, topOffset: 0},
    { column: 20, row: 7, leftOffset: 0, topOffset: 0},
    { column: 20, row: 7, leftOffset: 0, topOffset: 0},

    { column: 21, row: 13, leftOffset: 0, topOffset: 0},
    { column: 21, row: 15, leftOffset: 0, topOffset: 0},

    { column: 22, row: 0, leftOffset: 0, topOffset: 0},
    { column: 22, row: 6, leftOffset: 0, topOffset: 0},
    { column: 22, row: 11, leftOffset: 0, topOffset: 0},

    { column: 24, row: 2, leftOffset: 0, topOffset: 0},
    { column: 24, row: 4, leftOffset: 0, topOffset: 0},
    { column: 24, row: 9, leftOffset: 0, topOffset: 0},
    { column: 24, row: 16, leftOffset: 0, topOffset: 0},

    { column: 26, row: 0, leftOffset: 0, topOffset: -5},
    { column: 26, row: 2, leftOffset: 0, topOffset: 8},
    { column: 26, row: 7, leftOffset: 0, topOffset: 0},
    { column: 26, row: 13, leftOffset: 0, topOffset: 0},

    { column: 27, row: 5, leftOffset: 0, topOffset: 0},

    { column: 28, row: 11, leftOffset: 0, topOffset: 0},
  ].map((hole) => ({
    x: hole.column * (wallW + pathW) + 40 + hole.leftOffset,
    y: hole.row * (wallW + pathW) + 40 + hole.topOffset,
  }));

  // Draw the holes on the screen using the hole metadata defined above
  holes.forEach(({ x, y }) => {
    const ball = document.createElement("div");
    ball.setAttribute("class", "black-hole");
    ball.style.cssText = `left: ${x}px; top: ${y}px; width: ${holeSize}px; height: ${holeSize}px`;

    mazeElement.appendChild(ball);
  });

  // Defines the end of the maze (the white hole)
  export const end = {
    x: 28 * (wallW + pathW) + wallW + 32, 
    y:  9 * (wallW + pathW) + wallW,
  };

  // Draw the end on the screen using the end metadata defined above
  const endElement = document.createElement("div");
  endElement.setAttribute("id", "end");
  endElement.style.cssText = `left: ${end.x}px; top: ${end.y}px; width: ${endSize}px; height: ${endSize}px`;
  mazeElement.appendChild(endElement);