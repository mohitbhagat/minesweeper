import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store';

export type TileType = "clear" | "bomb";
export type TileStatus = "uncovered" | "covered";
export type TileIsFlagged = true | false;
export type GameStatus = "win" | "loss" | "active";

export type TileProps = {
  type: TileType, 
  status: TileStatus,
  isFlagged: TileIsFlagged,
  bombsHint: number,
  i: number,
  j: number
};


type GameState = {
  status: GameStatus,
  bombProb: number,
  grid: Array<Array<TileProps>>
};

// Helper function to assign bomb hints
const assignBombsHints = function(grid: Array<Array<TileProps>>): void {
  const tryUpdateBombsHint = function(grid: Array<Array<TileProps>>, i: number, j: number) {
    if(i < 0 || j < 0 || i >= grid.length || j >= grid.length) {
      return;
    }
    grid[i][j].bombsHint++;
  }

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid.length; j++) {
      if(grid[i][j].type === "bomb"){
        tryUpdateBombsHint(grid, i-1, j-1);
        tryUpdateBombsHint(grid, i-1, j);
        tryUpdateBombsHint(grid, i-1, j+1);
        tryUpdateBombsHint(grid, i, j-1);
        tryUpdateBombsHint(grid, i, j+1);
        tryUpdateBombsHint(grid, i+1, j-1);
        tryUpdateBombsHint(grid, i+1, j);
        tryUpdateBombsHint(grid, i+1, j+1);
      }
    }
  }
}

// Visited positions object
type VisitedPosns = {[key: string]: void};

// Helper function to recursively uncover cleared tiles
const uncoverRecurse = function(grid: Array<Array<TileProps>>, i: number, j: number, visited: VisitedPosns): void{
  if(i < 0 || j < 0 || i >= grid.length || j >= grid.length) { return; }
  if(grid[i][j].bombsHint != 0 || `${i}_${j}` in visited){
    grid[i][j].isFlagged = false;
    grid[i][j].status = 'uncovered';
    return;
  }
  visited[`${i}_${j}`] = undefined;
  grid[i][j].isFlagged = false;
  grid[i][j].status = "uncovered";
  uncoverRecurse(grid, i-1, j-1, visited);
  uncoverRecurse(grid, i-1, j, visited);
  uncoverRecurse(grid, i-1, j+1, visited);
  uncoverRecurse(grid, i, j-1, visited);
  uncoverRecurse(grid, i, j+1, visited);
  uncoverRecurse(grid, i+1, j-1, visited);
  uncoverRecurse(grid, i+1, j, visited);
  uncoverRecurse(grid, i+1, j+1, visited);
}

// Helper function to check for win
const checkWin = function(grid: Array<Array<TileProps>>): boolean {
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid.length; j++) {
      if(grid[i][j].status === "covered" && grid[i][j].type === "clear") {
        return false;
      }
    }
  }
  return true;
}

const getNewGrid = function(size: number, bombProb: number): Array<Array<TileProps>> {
  bombProb = bombProb % 1;
  let grid : Array<Array<TileProps>>= [];

  for(let i = 0; i < size; i++) {
    grid.push([]);
    for(let j = 0; j < size; j++) {
      let type: TileType = (Math.random() <= bombProb)? "bomb" : "clear";
      grid[i].push({
        type: type,
        status: 'covered',
        isFlagged: false,
        bombsHint: 0,
        i: i,
        j: j
      });
    }
  }
  assignBombsHints(grid);
  return grid;
}

const uncoverAllTiles = function(grid: Array<Array<TileProps>>) {
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid.length; j++) {
      grid[i][j].isFlagged = false;
      grid[i][j].status = "uncovered";
    }
  }
}

const initialState: GameState = {
  status: "active",
  bombProb: 0.2,
  grid: getNewGrid(5, 0.2)
}

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    toggleFlag: (state, action: PayloadAction<{i: number, j: number}>) => {
      let {i, j} = action.payload;
      if(state.grid[i][j].status === 'covered') {
        state.grid[i][j].isFlagged
          = !state.grid[i][j].isFlagged;
      }
    },
    uncoverTile: (state, action: PayloadAction<{i: number, j: number}>) => {
      let {i, j} = action.payload;
      if(state.grid[i][j].status === 'covered') {
        state.grid[i][j].status = 'uncovered';
        uncoverRecurse(state.grid, i, j, {});
        if(state.grid[i][j].type === 'bomb') {
          state.status = "loss";
          uncoverAllTiles(state.grid);
        } else if(checkWin(state.grid)) {
          state.status = "win";
          uncoverAllTiles(state.grid);
        }
      }
    },
    newGame: (state, action: PayloadAction<{size: number}>) => {
      const bombProb = state.bombProb % 1;
      state.status = "active";
      state.grid = getNewGrid(action.payload.size, bombProb);
    },
    retryGame: (state) => {
      state.status = "active";
      let theGrid = state.grid;
      for(let i = 0; i < theGrid.length; i++) {
        for(let j = 0; j < theGrid.length; j++) {
          theGrid[i][j].isFlagged = false;
          theGrid[i][j].status = "covered";
        }
      }
    }
  }
});

export const {toggleFlag, uncoverTile, newGame, retryGame} = gameSlice.actions;
export const selectGrid = (state: RootState) => state.game.grid;
export const selectGridSize = (state: RootState) => state.game.grid.length;
export const selectStatus = (state: RootState) => state.game.status;
export default gameSlice.reducer;
