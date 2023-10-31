import { atom } from "recoil";

export const SettingsModalAtom = atom({
  key: "settingsModalAtom",
  default: true,
});

export const DifficultiesAtom = atom({
  key: "difficultiesAtom",
  default: "Beginner",
});
