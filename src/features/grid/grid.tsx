import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectGrid, newGame } from '../game/gameSlice';
import Tile from './tile';
import '../../styles/grid.scss';
import { useEffect } from 'react';

type GridProps = {
  size: number,
}

export default function Grid({size}: GridProps) {
  const grid = useAppSelector(selectGrid);
  const dispatch = useAppDispatch();
  console.log(`New grid size ${size}`);

  useEffect(() => {
    dispatch(newGame({size: size}));
  }, [size]);

  const renderedTiles = grid.map((row) => {
    return(
      <div className="gridRow">
        {row.map((tile) => {
          return (
            <div className="gridCol">
              <Tile
                type={tile.type}
                status={tile.status} 
                isFlagged={tile.isFlagged}
                bombsHint={tile.bombsHint}
                i={tile.i}
                j={tile.j}
              />
            </div>
          );
        })}
      </div>
    )
  });

  console.log(renderedTiles);
  return (
    <div className="grid">
      {renderedTiles}
    </div>
  );
}