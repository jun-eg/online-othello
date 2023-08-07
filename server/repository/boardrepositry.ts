import type { UserId } from '$/commonTypesWithClient/branded';
import { userColorRepository } from './userColorRepository';
export type BoardArr = number[][];
export type Pos = { x: number; y: number };
let board: BoardArr = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 7, 0, 0, 0, 0],
  [0, 0, 7, 2, 1, 0, 0, 0],
  [0, 0, 0, 1, 2, 7, 0, 0],
  [0, 0, 0, 0, 7, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];
const re_board: BoardArr = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 7, 0, 0, 0, 0],
  [0, 0, 7, 2, 1, 0, 0, 0],
  [0, 0, 0, 1, 2, 7, 0, 0],
  [0, 0, 0, 0, 7, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];
const directions = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];
let turnColor = 1;
let black_number = 2;
let white_number = 2;
//0座標取得(候補地設置に使用)
const get_zero_positions = () => {
  const zero_positions: number[][] = [];
  board.map((y, rowIndex_y) => {
    y.map((x, colIndex_x) => {
      if (x === 0) {
        zero_positions.push([rowIndex_y, colIndex_x]);
      }
    });
  });
  return zero_positions;
};
//駒カウント
const count = (serch_number: number) => {
  let count = 0;
  board.forEach((row) =>
    row.forEach((cell) => {
      if (cell === serch_number) {
        count++;
      }
    })
  );
  return count;
};
//過去の黄色枠座標消去
const remove_yellow = () => {
  board.forEach((row, rowIndex) =>
    row.forEach((cell, cellIndex) => {
      if (cell === 7) {
        board[rowIndex][cellIndex] = 0;
      }
    })
  );
};
//隣が異色の場合、対ゴマ探しor候補地選出
//ここの複雑度下げる
const serch_turn_color = (
  a_position: number[],
  one_direction: number[],
  count: number,
  select: number,
  reversi_positions: number[][],
  temporary_reversi_positions: number[][]
) => {
  if (
    board[a_position[0] + one_direction[0] * count]?.[a_position[1] + one_direction[1] * count] ===
    turnColor
  ) {
    temporary_reversi_positions.push([
      a_position[0] + one_direction[0],
      a_position[1] + one_direction[1],
    ]);
    select === 0 && (board[a_position[0]][a_position[1]] = 7);
    reversi_positions.push(...temporary_reversi_positions);
    return reversi_positions;
  } else if (
    board[a_position[0] + one_direction[0] * count]?.[a_position[1] + one_direction[1] * count] ===
    3 - turnColor
  ) {
    temporary_reversi_positions.push([
      a_position[0] + one_direction[0] * count,
      a_position[1] + one_direction[1] * count,
    ]);
    count++;
    serch_turn_color(
      a_position,
      one_direction,
      count,
      select,
      reversi_positions,
      temporary_reversi_positions
    );
  }
  temporary_reversi_positions = [];
};
//8方向参照
//ここの複雑度下げる
const Possible_click_positions = (positions: number[][], select: number): number[][] => {
  let result: number[][] | undefined = undefined;
  let reversi_positions: number[][] = [];
  const temporary_reversi_positions: number[][] = [];
  positions.forEach((a_position) => {
    directions.forEach((one_direction) => {
      if (
        board[a_position[0] + one_direction[0]]?.[a_position[1] + one_direction[1]] ===
        3 - turnColor
      ) {
        result = serch_turn_color(
          a_position,
          one_direction,
          2,
          select,
          reversi_positions,
          temporary_reversi_positions
        );
        result && (reversi_positions = result);
      }
    });
  });

  return reversi_positions;
};
//駒設置と裏返し処理
const othello = (y: number, x: number) => {
  if (board[y][x] === 7) {
    board[y][x] = turnColor;
    const reversi_positions: number[][] = Possible_click_positions([[y, x]], 1);
    reversi_positions.forEach((n) => {
      board[n[0]][n[1]] = turnColor;
    });

    turnColor = 3 - turnColor;
  }
};
//pass
const pass = () => {
  count(7) === 0 && (turnColor = 3 - turnColor);
  Possible_click_positions(get_zero_positions(), 0);
};
//reset
const reset = (y: number, x: number) => {
  if (y === 8 && x === 8) {
    board = re_board;
    remove_yellow();
  }
};
export const boardrepository = {
  getBoard: (): {
    board: BoardArr;
    turnColor: number;
    black_number: number;
    white_number: number;
  } => {
    return { board, turnColor, black_number, white_number };
  },
  clickBoard: (params: Pos, userId: UserId): BoardArr => {
    if (turnColor === userColorRepository.getUserColor(userId)) {
      console.log(1);
      othello(Math.min(7, params.y), Math.min(7, params.x));
      console.log(2);
      remove_yellow();
      console.log(3);
      Possible_click_positions(get_zero_positions(), 0);
      console.log(4);
      reset(params.y, params.x);
      console.log(5);
      black_number = count(1);
      white_number = count(2);
      console.log(6);
      pass();
      console.log(1);
    }
    return board;
  },
};
