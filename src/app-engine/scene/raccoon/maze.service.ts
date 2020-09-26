import { Injectable } from '@angular/core';
import { ImpassableTile, PassableTile, Player, Tile } from './entities';

@Injectable({
  providedIn: 'root',
})
export class MazeService {

  maze: Tile[][];

  constructor() { }

  generateMaze(mazeHeight: number, mazeWidth: number): Tile[][] {
    const moves = [];
    this.maze = [];
    const unvisited = [];
    for (let i = 0; i < mazeHeight; i++) {
      this.maze[i] = [];
      unvisited[i] = [];
      for (let j = 0; j < mazeWidth; j++) {
        this.maze[i][j] = ImpassableTile.BUSH;
        unvisited[i][j] = true;
      }
    }
    for (let i = 0; i < mazeHeight; i++) {
      unvisited[i][0] = false;
      unvisited[i][mazeWidth - 1] = false;
    }
    for (let i = 0; i < mazeWidth; i++) {
      unvisited[0][i] = false;
      unvisited[mazeHeight - 1][i] = false;
    }
    let posX = Math.floor(Math.random() * (mazeWidth - 2)) + 1;
    let posY = Math.floor(Math.random() * (mazeHeight - 2)) + 1;
    this.maze[posX][posY] = PassableTile.ROAD;
    moves.push(posY + posX * mazeWidth);
    while (moves.length) {
      let possibleDirections = '';
      if (unvisited[posX + 1][posY]
        && this.maze[posX + 1][posY] === ImpassableTile.BUSH
        && this.checkCell(posX + 1, posY, moves[moves.length - 1], this.maze, unvisited)) {
        possibleDirections += 'S';
      }
      if (unvisited[posX - 1][posY]
        && this.maze[posX - 1][posY] === ImpassableTile.BUSH
        && this.checkCell(posX - 1, posY, moves[moves.length - 1], this.maze, unvisited)) {
        possibleDirections += 'N';
      }
      if (unvisited[posX][posY - 1]
        && this.maze[posX][posY - 1] === ImpassableTile.BUSH
        && this.checkCell(posX, posY - 1, moves[moves.length - 1], this.maze, unvisited)) {
        possibleDirections += 'W';
      }
      if (unvisited[posX][posY + 1]
        && this.maze[posX][posY + 1] === ImpassableTile.BUSH
        && this.checkCell(posX, posY + 1, moves[moves.length - 1], this.maze, unvisited)) {
        possibleDirections += 'E';
      }
      if (possibleDirections) {
        const move = Math.round(Math.random() * (possibleDirections.length - 1));
        switch (possibleDirections[move]) {
          case 'N':
            this.maze[posX - 1][posY] = PassableTile.ROAD;
            posX -= 1;
            break;
          case 'S':
            this.maze[posX + 1][posY] = PassableTile.ROAD;
            posX += 1;
            break;
          case 'W':
            this.maze[posX][posY - 1] = PassableTile.ROAD;
            posY -= 1;
            break;
          case 'E':
            this.maze[posX][posY + 1] = PassableTile.ROAD;
            posY += 1;
            break;
        }
        unvisited[posX][posY] = false;
        moves.push(posY + posX * mazeWidth);
      } else {
        const back = moves.pop();
        posX = Math.floor(back / mazeWidth);
        posY = back % mazeWidth;
      }
    }
    return this.maze;
  }

  placeObjects(maze: Tile[][], player: Player, maxExits: number): void {
    let exitsCounter = 0;
    let playerSet = true;
    for (let i = 0; i < maze[0].length; i++) {
      for (let j = 0; j < maze[0].length; j++) {
        if (maze[i][j] === PassableTile.ROAD) {
          let end = 0;
          for (let k = -1; k < 2; k++) {
            if (maze[i][j + k] === ImpassableTile.BUSH) {
              end++;
            }
          }
          for (let k = -1; k < 2; k++) {
            if (maze[i + k][j] === ImpassableTile.BUSH) {
              end++;
            }
          }
          if (end === 3) {
            if (playerSet) {
              playerSet = false;
              player.position = { x: j, y: i };
            } else {
              if (exitsCounter < maxExits) {
                maze[i][j] = PassableTile.FINAL;
                exitsCounter++;
              }
            }
          }
        }
      }
    }
  }

  checkCell(x: number, y: number, back: number, maze: Tile[][], unvisited: boolean[][]): boolean {
    const prPosX = Math.floor(back / maze.length);
    const prPosY = back % maze[0].length;
    let end = 0;
    for (let k = -1; k < 2; k++) {
      for (let l = -1; l < 2; l++) {
        if (maze[x + k][y + l] === ImpassableTile.BUSH) {
          end++;
        } else {
          if (Math.abs(x + k - prPosX) === 2 || Math.abs(y + l - prPosY) === 2) {
            unvisited[x][y] = false;
            return false;
          }
        }
      }
    }
    if (end < 7) {
      unvisited[x][y] = false;
      return false;
    } else {
      return true;
    }
  }
}
