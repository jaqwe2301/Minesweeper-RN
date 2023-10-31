// 지뢰 보드 생성
export function generateMinesBoard(
  rows: number,
  cols: number,
  mineCount: number
): boolean[][] {
  let minesBoard: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  );

  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * cols);

    if (!minesBoard[randomRow][randomCol]) {
      minesBoard[randomRow][randomCol] = true;
      minesPlaced++;
    }
  }
  return minesBoard;
}

// 게임 상태 보드 생성
export function generateStateBoard(
  rows: number,
  cols: number,
  minesBoard: boolean[][]
): number[][] {
  let stateBoard: number[][] = Array.from({ length: rows }, () => []);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const neighbors = [
        [row - 1, col - 1],
        [row - 1, col],
        [row - 1, col + 1],
        [row, col - 1],
        [row, col + 1],
        [row + 1, col - 1],
        [row + 1, col],
        [row + 1, col + 1],
      ];

      let trueCount = 0;

      for (let [nRow, nCol] of neighbors) {
        if (
          nRow >= 0 &&
          nRow < minesBoard.length &&
          nCol >= 0 &&
          nCol < minesBoard[0].length &&
          minesBoard[nRow][nCol]
        ) {
          trueCount++;
        }
      }

      stateBoard[row][col] = trueCount;
    }
  }

  return stateBoard;
}
