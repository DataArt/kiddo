import { ConsoleVariable } from './console-variable';

export interface TileSceneWinCondition {
  pickAllCompulsoryObjects: boolean;
}

export interface ConsoleSceneWinCondition {
  consoleWindow: {
    content: string[],
    dynamicValues: boolean,
  };
  consoleVariables: ConsoleVariable[];
}

export type WinCondition = TileSceneWinCondition | ConsoleSceneWinCondition;
