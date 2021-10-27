import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { uncoverTile, selectGridSize, toggleFlag } from '../game/gameSlice';
import type { TileProps } from '../game/gameSlice';
import '../../styles/tile.scss';

export default function Tile({type, status, isFlagged, bombsHint, i, j} : TileProps) {
  const gridSize = useAppSelector(selectGridSize);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(uncoverTile({i: i, j: j}));
  }

  const handleRightClick = (event: any) => {
    event.preventDefault();
    dispatch(toggleFlag({i: i, j: j}));
  }

  const tileWidth = (100 / gridSize) * 0.5;
  const tileMargin = Math.min(1, Math.log(tileWidth)/Math.log(25));
  const tileStyle = {
    width: `${tileWidth}vh`,
    height: `${tileWidth}vh`,
    margin: `${tileMargin}vh`
  };

  let renderedTile;

  if(isFlagged) {
    renderedTile = <div className="tile flagged" style={tileStyle} onContextMenu={handleRightClick}></div>
  } else {
    renderedTile = 
      <div className="tile covered" style={tileStyle} onClick={handleClick} onContextMenu={handleRightClick}>
        <div style={{display: (status === 'covered')? 'none' : 'block', width: "inherit", height: "inherit"}}>
          <div className="bomb" style={{display: (type === 'bomb')? 'inherit' : 'none'}}></div>
          <div className="clear" style={{display: (type === 'bomb')? 'none' : 'flex'}}>
            <div>
              {bombsHint}
            </div>
          </div>
        </div>
      </div>
    ;
  }

  return (
    <div>
      {renderedTile}
    </div>
  );
}
