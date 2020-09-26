import { SceneType } from '../../common/models/scene-type.enum';
import { ConsoleSceneWinCondition, ConsoleVariable, WinButton } from '../../common/entities';
import { SceneConfig } from '../../common/scene-config';

export interface ConsoleSceneConfig extends SceneConfig {
  sceneType: SceneType.CONSOLE;
  generatingFunc?: string;
  variables: ConsoleVariable[];
  winButton?: WinButton;
  winCondition: ConsoleSceneWinCondition;
  initialScript: string;
  taskDescription: string;
}
