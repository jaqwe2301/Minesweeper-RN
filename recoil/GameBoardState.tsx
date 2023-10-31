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
  // console.log(minesBoard);
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
