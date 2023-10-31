import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useRecoilState } from "recoil";
import { MinesBoardAtom, StateBoardAtom } from "../recoil/GameBoardState";

import SettingsModal from "../components/SettingsModal";

function Minesweeper() {
  const [minesBoard, setMinesBoard] = useRecoilState(MinesBoardAtom);
  const [stateBoard, setStateBoard] = useRecoilState(StateBoardAtom);

  const { width, height } = useWindowDimensions();

  const styles = getStyles(width - 40, height - 40);

  return (
    <>
      <SettingsModal />
      <View style={styles.container}>
        <View style={styles.header}></View>
        {stateBoard.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => {
              return (
                <Pressable
                  key={colIndex}
                  style={styles.cell}
                  onPress={() => {
                    // 셀을 클릭했을 때의 로직
                  }}
                  onLongPress={() => {
                    // 길게 눌렀을 때의 로직 (예: 깃발을 표시한다)
                  }}
                >
                  <Text style={styles.cellText}>
                    {minesBoard[rowIndex][colIndex]
                      ? "💣"
                      : cell.toString() === "0"
                      ? ""
                      : cell.toString()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </>
  );
}

export default Minesweeper;

const getStyles = (width: number, height: number) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "grey",
      justifyContent: "center",
      alignItems: "center",
    },
    row: {
      flexDirection: "row",
    },
    header: {
      height: 50,
      width: width,
      backgroundColor: "white",
    },
    cell: {
      width: 30,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#000",
    },
    cellText: {
      fontSize: 12,
    },
  });
};
