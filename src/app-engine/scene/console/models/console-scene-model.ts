import { SceneType } from '../../common/models/scene-type.enum';
import { SceneModel } from '../../common/models/scene-model';
import { ConsoleVariable, CheckingLogic } from '../../common/entities';

export interface ConsoleSceneModel extends SceneModel {
  sceneType: SceneType.CONSOLE;
  consoleContent: string[];
  consoleVariables: ConsoleVariable[];
  checkingLogic: CheckingLogic;
}
