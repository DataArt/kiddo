import { ExecutionLog, PlayerAction } from './raccoon-tracker.types';
import { Singleton } from '../../../singleton.decorator';

@Singleton
export class RaccoonTrackerService {
  private execLog: ExecutionLog = {
    actions: [],
    victoryAchieved: null
  };

  constructor() {
  }

  getExecutionLog(): ExecutionLog {
    return this.execLog;
  }

  addPlayerAction(action: PlayerAction): void {
    this.execLog.actions.push(action);
  }
}
