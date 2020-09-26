export enum Direction {
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
  UP = 'UP',
  DOWN = 'DOWN',
  UP_RIGHT = 'UP_RIGHT',
  UP_LEFT = 'UP_LEFT',
  DOWN_RIGHT = 'DOWN_RIGHT',
  DOWN_LEFT = 'DOWN_LEFT',
}

export const moveDirections = {
  [Direction.UP]: {
      x: 0,
      y: -1,
      step: -1,
      numericValue: 0,
      oppositeDirection: Direction.DOWN
    },
    [Direction.UP_RIGHT]: {
      x: 1,
      y: -1,
      step: 0,
      numericValue: 1,
      oppositeDirection: Direction.DOWN_LEFT
    },
    [Direction.RIGHT]: {
      x: 1,
      y: 0,
      step: 1,
      numericValue: 2,
      oppositeDirection: Direction.LEFT
    },
    [Direction.DOWN_RIGHT]: {
      x: 1,
      y: 1,
      step: 2,
      numericValue: 3,
      oppositeDirection: Direction.UP_LEFT
    },
    [Direction.DOWN]: {
      x: 0,
      y: 1,
      step: 1,
      numericValue: 4,
      oppositeDirection: Direction.UP
    },
    [Direction.DOWN_LEFT]: {
      x: -1,
      y: 1,
      step: 0,
      numericValue: 5,
      oppositeDirection: Direction.UP_RIGHT
    },
    [Direction.LEFT]: {
      x: -1,
      y: 0,
      step: -1,
      numericValue: 6,
      oppositeDirection: Direction.RIGHT
    },
    [Direction.UP_LEFT]: {
      x: -1,
      y: -1,
      step: -2,
      numericValue: 7,
      oppositeDirection: Direction.DOWN_RIGHT
    },
};

export enum TurnDirection {
  CLOCKWISE = 'CLOCKWISE',
  ANTICLOCKWISE = 'ANTICLOCKWISE'
}
