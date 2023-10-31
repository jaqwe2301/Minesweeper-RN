import { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useRecoilState } from "recoil";
import {
  MinesBoardAtom,
  StateBoardAtom,
  MinesCountAtom,
  OpenStateAtom,
} from "../recoil/GameBoardState";
import { SettingsModalAtom, TimeAtom } from "../recoil/SettingsModalAtom";

import SettingsModal from "../components/SettingsModal";

function Minesweeper() {
  const [minesBoard, setMinesBoard] = useRecoilState(MinesBoardAtom);
  const [stateBoard, setStateBoard] = useRecoilState(StateBoardAtom);
  const [minesCount, setMinesCount] = useRecoilState(MinesCountAtom);
  const [modalVisible, setModalVisible] = useRecoilState(SettingsModalAtom);
  const [openState, setOpenState] = useRecoilState(OpenStateAtom);
  const [time, setTime] = useRecoilState(TimeAtom);

  const { width, height } = useWindowDimensions();

  const styles = getStyles(width - 40, height - 40);

  useEffect(() => {
    if (!modalVisible) {
      setInterval(() => {
        setTime((prevTime) => prevTime + 1); // 초 단위로 시간 증가
      }, 1000);
    }
  }, [modalVisible]);

  const handleCellPress = (rowIndex: number, colIndex: number) => {
    if (minesBoard[rowIndex][colIndex]) {
      // 만약 클릭한 셀이 지뢰라면
      alert(
        "You hit a mine!\nGame over.\n찾은 지뢰 수: " +
          (minesCount.sum - minesCount.rest)
      );
    } else {
      let newStateBoard = [...openState];
      newStateBoard[rowIndex][colIndex] = true; // 클릭된 상태로 변경
      setOpenState(newStateBoard);
    }
  };

  return (
    <>
      <SettingsModal />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>{"남은 지뢰 수: " + minesCount.rest + "   "}</Text>
          <Text>{"진행시간: " + time}</Text>
        </View>
        {stateBoard.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => {
              const isOpened = openState[rowIndex][colIndex];
              return (
                <Pressable
                  key={colIndex}
                  style={[
                    styles.cell,
                    {
                      borderColor: isOpened ? "#000" : "#FFF",
                      backgroundColor: isOpened ? "#AAA" : "#CCC",
                    },
                  ]}
                  onPress={() => handleCellPress(rowIndex, colIndex)}
                  onLongPress={() => {
                    // 길게 눌렀을 때의 로직 (예: 깃발을 표시한다)
                  }}
                >
                  <Text
                    style={[
                      styles.cellText,
                      { color: isOpened ? "#000" : "transparent" }, // 클릭되지 않았을 때 텍스트 숨기기
                    ]}
                  >
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
      flexDirection: "row",
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
