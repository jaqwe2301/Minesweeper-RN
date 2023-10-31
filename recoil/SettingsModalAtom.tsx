import { atom } from "recoil";

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
