import { atom } from "recoil";

export type Cell = {
  surroundingMines: number; // 주변에 있는 지뢰의 수
  isOpen: boolean; // 해당 셀이 사용자에게 보여지고 있는지 여부
  hasFlag: boolean; // 해당 셀에 깃발이 표시되어 있는지 여부
};

export interface MinesCountAtom {
  sum: number;
  rest: number;
}

export const MinesBoardAtom = atom<boolean[][]>({
  key: "minesBoardAtom",
  default: [],
});

export const StateBoardAtom = atom<number[][]>({
  key: "stateBoardAtom",
  default: [],
});

export const OpenStateAtom = atom<boolean[][]>({
  key: "openStateAtom",
  default: [],
});

export const FlagStateAtom = atom<boolean[][]>({
  key: "flagStateAtom",
  default: [],
});

export const MinesCountAtom = atom<MinesCountAtom>({
  key: "minesCountAtom",
  default: { sum: 0, rest: 0 },
});
