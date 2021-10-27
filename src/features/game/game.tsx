import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectStatus, retryGame, newGame, selectGridSize} from '../game/gameSlice';
import Grid from '../grid/grid';
import '../../styles/game.scss';

type GameProps = {
  size: number,
}

export default function Game({size} : GameProps) {
  const status = useAppSelector(selectStatus);
  const gridSize = useAppSelector(selectGridSize);
  const dispatch = useAppDispatch();

  const handleRetry = () => {
    dispatch(retryGame());
  }

  const handleNewGame = () => {
    dispatch(newGame({size: gridSize}));
  }


  let statusText = "Click on tiles to reveal them. Right-click to flag tiles. Reveal all the tiles to win.";
  if(status === "win") {
    statusText = "YOU WIN!";
  } else if(status === "loss") {
    statusText = "YOU LOSE";
  }

  return (
    <div className="game">
      <ul className="gameOptions">
        <li className="gameOption" onClick={handleRetry}>Retry</li>
        <li className="gameOption" onClick={handleNewGame}>New Game</li>
      </ul>
      <div className="gameStatus">
        {statusText}
      </div>
      <div className={`playArea ${(status === 'active') ? "" : "disableClick"}`}>
        <Grid size={size}/>
      </div>
    </div>
  );
};

