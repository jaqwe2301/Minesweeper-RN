import { atom } from "recoil";

type T = ReturnType<typeof setInterval> | null;

export const SettingsModalAtom = atom({
  key: "settingsModalAtom",
  default: true,
});

export const DifficultiesAtom = atom({
  key: "difficultiesAtom",
  default: "Beginner",
});

export const TimeAtom = atom({
  key: "timeAtom",
  default: 0,
});

export const GameStartAtom = atom({
  key: "gameStartAtom",
  default: false,
});

export const TimeIdAtom = atom<T>({
  key: "timeIdAtom",
  default: null,
});

export const BoardColSizeState = atom({
  key: "boardColSizeState",
  default: 0,
});
