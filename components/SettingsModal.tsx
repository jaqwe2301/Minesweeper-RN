import { View, Modal, Text, StyleSheet, Pressable } from "react-native";
import { useRecoilState } from "recoil";
import {
  MinesBoardAtom,
  StateBoardAtom,
  MinesCountAtom,
  OpenStateAtom,
  FlagStateAtom,
} from "../recoil/GameBoardState";
import {
  SettingsModalAtom,
  DifficultiesAtom,
  TimeAtom,
  TimeIdAtom,
} from "../recoil/SettingsModalAtom";
import { generateMinesBoard, generateStateBoard } from "../logic/GameHandler";

type Difficulty = "Beginner" | "Intermediate" | "Expert";
type T = ReturnType<typeof setInterval>;

function SettingsModal() {
  const [minesBoard, setMinesBoard] = useRecoilState(MinesBoardAtom);
  const [stateBoard, setStateBoard] = useRecoilState(StateBoardAtom);
  const [minesCount, setMinesCount] = useRecoilState(MinesCountAtom);
  const [openState, setOpenState] = useRecoilState(OpenStateAtom);
  const [flagState, setFlagState] = useRecoilState(FlagStateAtom);
  const [time, setTime] = useRecoilState(TimeAtom);
  const [timeId, setTimeId] = useRecoilState(TimeIdAtom);

  const [modalVisible, setModalVisible] = useRecoilState(SettingsModalAtom);
  const [difficulty, setDifficulty] = useRecoilState(DifficultiesAtom);

  const difficulties = {
    Beginner: { rows: 8, cols: 8, mines: 10 },
    Intermediate: { rows: 14, cols: 10, mines: 40 },
    Expert: { rows: 32, cols: 14, mines: 99 },
  };

  const handleApply = () => {
    const { rows, cols, mines } = difficulties[difficulty as Difficulty];
    const initialFalseArray = Array.from({ length: rows }, () =>
      Array(cols).fill(false)
    );

    if (!timeId) {
      const id: T = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      setTimeId(id);
    } else {
      clearInterval(timeId);
      setTime(0);
      const newTimerId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      setTimeId(newTimerId);
    }

    const newMinesBoard = generateMinesBoard(rows, cols, mines);
    const newStateBoard = generateStateBoard(rows, cols, newMinesBoard);

    setMinesBoard(newMinesBoard);
    setStateBoard(newStateBoard);

    setMinesCount({ sum: mines, rest: mines });
    setOpenState(initialFalseArray);
    setFlagState(initialFalseArray);
    setModalVisible(false);
  };

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>😆새로운 게임😆</Text>
            {Object.keys(difficulties).map((key) => {
              const difficultyKey = key as Difficulty;
              return (
                <Pressable
                  key={difficultyKey}
                  onPress={() => setDifficulty(difficultyKey)}
                  style={
                    difficulty === difficultyKey
                      ? styles.selected
                      : styles.option
                  }
                >
                  <Text>
                    {difficultyKey} - {difficulties[difficultyKey].rows}X
                    {difficulties[difficultyKey].cols}{" "}
                    {difficulties[difficultyKey].mines} mines
                  </Text>
                </Pressable>
              );
            })}
            <View style={styles.buttonContainer}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={[styles.button, { backgroundColor: "grey" }]}
              >
                <Text style={{ color: "white" }}>취소</Text>
              </Pressable>
              <Pressable
                onPress={handleApply}
                style={[styles.button, { backgroundColor: "#2196F3" }]}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>적용</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    flex: 1,
    width: 300,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  option: {
    padding: 10,
    margin: 5,
  },
  selected: {
    padding: 10,
    margin: 5,
    backgroundColor: "#e0e0e0",
  },
});

export default SettingsModal;
