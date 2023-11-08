import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
  Alert,
} from "react-native";
import { useRecoilState } from "recoil";
import {
  MinesBoardAtom,
  StateBoardAtom,
  MinesCountAtom,
  OpenStateAtom,
  FlagStateAtom,
  IsGameOverState,
} from "../recoil/GameBoardState";
import {
  SettingsModalAtom,
  TimeAtom,
  GameStartAtom,
  TimeIdAtom,
  BoardColSizeState,
} from "../recoil/SettingsModalAtom";

import SettingsModal from "../components/SettingsModal";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Minesweeper = React.memo(() => {
  const [minesBoard, setMinesBoard] = useRecoilState(MinesBoardAtom);
  const [stateBoard, setStateBoard] = useRecoilState(StateBoardAtom);
  const [minesCount, setMinesCount] = useRecoilState(MinesCountAtom);
  const [modalVisible, setModalVisible] = useRecoilState(SettingsModalAtom);
  const [openState, setOpenState] = useRecoilState(OpenStateAtom);
  const [flagState, setFlagState] = useRecoilState(FlagStateAtom);
  const [time, setTime] = useRecoilState(TimeAtom);
  const [gameStart, setGameStart] = useRecoilState(GameStartAtom);
  const [timeId, setTimeId] = useRecoilState(TimeIdAtom);
  const [boardColSize, setBoardColSize] = useRecoilState(BoardColSizeState);
  const [isGameOver, setIsGameOver] = useRecoilState(IsGameOverState);

  const { width, height } = useWindowDimensions();

  const styles = getStyles(width - 40, height - 40, boardColSize);

  useEffect(() => {
    if (!modalVisible && checkVictory()) {
      alert("게임에서 승리하셨습니다!");
      setIsGameOver(true);
      if (timeId) {
        clearInterval(timeId);
      }
      return () => {
        if (timeId) {
          clearInterval(timeId);
        }
      };
    }
  }, [openState]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeId) {
        clearInterval(timeId);
      }
    };
  }, [timeId]);

  const DIRECTIONS = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  // 타이머 시작
  const startTimer = () => {
    if (!timeId) {
      const id = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      setTimeId(id);
    }
  };

  // 타이머 일시정지
  const pauseTimer = () => {
    if (timeId) {
      clearInterval(timeId);
      setTimeId(null);
    }
  };

  // 지뢰를 밟았을 때
  const hitMine = () => {
    pauseTimer();
    setIsGameOver(true);
  };

  // 게임 재개
  const resumeGame = () => {
    startTimer();
    setIsGameOver(false);
  };

  // 게임 재시작
  const restartGame = () => {
    setIsGameOver(false);
    setTime(0);
    startTimer();
  };

  // 승리 체크 함수
  const checkVictory = () => {
    for (let i = 0; i < stateBoard.length; i++) {
      for (let j = 0; j < stateBoard[i].length; j++) {
        if (!minesBoard[i][j] && !openState[i][j]) {
          // 지뢰가 아닌 셀 중 열리지 않은 셀이 있다면 아직 승리하지 않음
          return false;
        }
      }
    }
    return true; // 모든 지뢰가 아닌 셀이 열렸다면 승리
  };

  const openAdjacentCells = (
    rowIndex: number,
    colIndex: number,
    openState: boolean[][]
  ) => {
    // 지뢰가 아니라면 오픈
    if (!minesBoard[rowIndex][colIndex]) {
      openState[rowIndex][colIndex] = true;
    }
    for (let [dx, dy] of DIRECTIONS) {
      let newX = rowIndex + dx;
      let newY = colIndex + dy;

      // 새 위치가 유효한 범위 내에 있는지 확인
      if (
        newX >= 0 &&
        newX < openState.length &&
        newY >= 0 &&
        newY < openState[newX].length
      ) {
        if (
          // 주변 셀이 아직 열리지 않았고, 지뢰가 아닐 경우 -> 오픈
          openState[newX][newY] === false &&
          minesBoard[newX][newY] === false
        ) {
          openState[newX][newY] = true;

          // 주변 셀이 아직 열리지 않은 빈 셀일 경우
          if (stateBoard[newX][newY] === 0) {
            openState = openAdjacentCells(newX, newY, openState);
          }
        }
      }
    }
    return openState;
  };

  const reGame = (rowIndex: number, colIndex: number) => {
    resumeGame();
    handleFlagPress(rowIndex, colIndex);
  };

  const handleCellPress = (rowIndex: number, colIndex: number) => {
    if (!flagState[rowIndex][colIndex]) {
      setOpenState((prev) => {
        let prevState = JSON.parse(JSON.stringify(prev)); // 깊은 복사

        if (
          stateBoard[rowIndex][colIndex] > 0 ||
          minesBoard[rowIndex][colIndex]
        ) {
          prevState[rowIndex][colIndex] = true;
        } else if (
          // 만약 셀에 숫자가 없고 지뢰도 없다면 (즉, 빈 셀이라면), 해당 셀 주변의 8개 셀을 검사.
          prev[rowIndex][colIndex] === false &&
          minesBoard[rowIndex][colIndex] === false &&
          stateBoard[rowIndex][colIndex] === 0
        ) {
          prevState = openAdjacentCells(rowIndex, colIndex, prevState);
        }
        return prevState;
      });

      if (minesBoard[rowIndex][colIndex]) {
        // 만약 클릭한 셀이 지뢰라면
        hitMine();
        Alert.alert("Game over", "You hit a mine!", [
          {
            text: "게임 재시작",
            onPress: () => restartGame(),
            style: "cancel",
          },
          {
            text: "게임 재개",
            onPress: () => reGame(rowIndex, colIndex),
          },
        ]);
      }
    }
  };
  const handleFlagPress = (rowIndex: number, colIndex: number) => {
    if (!openState[rowIndex][colIndex]) {
      let flagChanged = !flagState[rowIndex][colIndex];
      let updatedMinesCount = {
        ...minesCount,
        rest: flagChanged ? minesCount.rest - 1 : minesCount.rest + 1,
      };

      setMinesCount(updatedMinesCount);

      setFlagState((prevFlagState) => {
        let prevState = JSON.parse(JSON.stringify(prevFlagState)); // 깊은 복사
        prevState[rowIndex][colIndex] = flagChanged;
        return prevState;
      });
    }
  };

  return (
    <>
      <SettingsModal />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={{ width: 110 }}>
            {"남은 지뢰 수: " + minesCount.rest + "   "}
          </Text>
          <Pressable onPress={() => setModalVisible(true)}>
            <Icon name="cog-pause" size={42} />
          </Pressable>
          <Text style={{ width: 110 }}>{"진행시간: " + time}</Text>
        </View>
        <View style={styles.contents}>
          <View style={styles.cellContainer}>
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
                          borderColor:
                            isOpened || flagState[rowIndex][colIndex]
                              ? "#000"
                              : "#FFF",
                          backgroundColor:
                            isOpened || flagState[rowIndex][colIndex]
                              ? "#AAA"
                              : "#CCC",
                        },
                      ]}
                      onPress={() =>
                        !isGameOver ? handleCellPress(rowIndex, colIndex) : ""
                      }
                      onLongPress={() =>
                        // 길게 눌렀을 때의 로직 -> 깃발 표시
                        !isGameOver ? handleFlagPress(rowIndex, colIndex) : ""
                      }
                    >
                      <Text
                        style={[
                          styles.cellText,
                          {
                            color:
                              isOpened || flagState[rowIndex][colIndex]
                                ? "#000"
                                : "transparent",
                          }, // 클릭되지 않았을 때 텍스트 숨기기
                        ]}
                      >
                        {flagState[rowIndex][colIndex]
                          ? "🚩"
                          : minesBoard[rowIndex][colIndex]
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
        </View>
      </View>
    </>
  );
});

export default Minesweeper;

const getStyles = (width: number, height: number, cellSize: number) => {
  // const getStyles = (width: number, height: number) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#BDBDBD",
      justifyContent: "center",
      alignItems: "center",
    },
    row: {
      flexDirection: "row",
    },
    header: {
      height: 50,
      width: width,
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "white",
      flexDirection: "row",
    },
    contents: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#606060",
      width: width,
    },
    cellContainer: {
      borderWidth: 4,
      borderColor: "grey",
    },
    cell: {
      width: cellSize,
      height: cellSize,
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
