import Minesweeper from "./screens/Minesweeper";
import { RecoilRoot } from "recoil";

const App = () => {
  return (
    <RecoilRoot>
      <Minesweeper />
    </RecoilRoot>
  );
};

export default App;
