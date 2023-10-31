import { atom } from "recoil";

export type Cell = {
  surroundingMines: number; // 주변에 있는 지뢰의 수
  isOpen: boolean; // 해당 셀이 사용자에게 보여지고 있는지 여부
  hasFlag: boolean; // 해당 셀에 깃발이 표시되어 있는지 여부
};

export const MinesBoardAtom = atom<boolean[][]>({
  key: "minesBoardAtom",
  default: [],
});

export const StateBoardAtom = atom<Cell[][]>({
  key: "stateBoardAtom",
  default: [],
});

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
): Cell[][] {
  let stateBoard: Cell[][] = Array(rows)
    .fill(null)
    .map(() =>
      Array(cols).fill({
        surroundingMines: 0,
        isOpen: false,
        hasFlag: false,
      })
    );

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (minesBoard[row][col]) continue;

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

      let mineCount = 0;
      for (let [nRow, nCol] of neighbors) {
        if (
          nRow >= 0 &&
          nRow < rows &&
          nCol >= 0 &&
          nCol < cols &&
          minesBoard[nRow][nCol]
        ) {
          mineCount++;
        }
      }

      stateBoard[row][col].surroundingMines = mineCount;
    }
  }

  return stateBoard;
}
