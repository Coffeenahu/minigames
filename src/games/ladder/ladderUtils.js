/**
 * Fisher-Yates Shuffle algorithm for results
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Generate a ladder grid with no adjacent horizontal lines.
 * ladder[row][col] === true means there's a horizontal line between col and col+1
 */
export const generateLadder = (cols, rows) => {
  const grid = Array.from({ length: rows }, () => Array(cols - 1).fill(false));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 1; c++) {
      // 1. Randomly decide to place a line
      // 2. CHECK: Must not have a line at c-1 in the same row
      if (Math.random() > 0.5) {
        if (c === 0 || !grid[r][c - 1]) {
          grid[r][c] = true;
        }
      }
    }
  }
  return grid;
};

/**
 * Trace the exact path for a specific starting column.
 * Returns an array of coordinates [{col, row}, ...]
 */
export const tracePath = (grid, startCol) => {
  const rows = grid.length;
  const path = [];
  let currentCol = startCol;

  // Start point
  path.push({ col: currentCol, row: 0 });

  for (let r = 0; r < rows; r++) {
    // Check right (if currentCol is c)
    if (grid[r][currentCol]) {
      path.push({ col: currentCol, row: r + 1 }); // Move down to row
      currentCol++;
      path.push({ col: currentCol, row: r + 1 }); // Move right
    } 
    // Check left (if currentCol is c+1)
    else if (currentCol > 0 && grid[r][currentCol - 1]) {
      path.push({ col: currentCol, row: r + 1 }); // Move down to row
      currentCol--;
      path.push({ col: currentCol, row: r + 1 }); // Move left
    }
    // No horizontal line, just move down at the end of loop
  }

  // End point (bottom)
  path.push({ col: currentCol, row: rows + 1 });

  return path;
};

/**
 * Pre-calculate all final results for mapping
 */
export const mapResults = (grid, cols) => {
  const results = [];
  for (let i = 0; i < cols; i++) {
    const path = tracePath(grid, i);
    const finalCol = path[path.length - 1].col;
    results[i] = finalCol; // Player i reaches Outcome at finalCol
  }
  return results;
};
