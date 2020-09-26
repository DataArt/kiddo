import { Component, OnInit, Self, Input } from '@angular/core';
import { ConsoleVariable } from '../../../app-engine/scene/common/entities';
import { ScriptRunnerService } from '../../../app-engine/script-runner/script-runner.service';
import { takeUntil, tap } from 'rxjs/operators';
import { Destroyed } from '../../shared/services';
import { scriptExecutionState } from '../../../app-engine/script-runner/script-runner.types';
import { ConsoleReaderService } from '../../../app-engine/scene/console/readers/console-reader.service';
import { SceneAccessorsService } from '../../../app-engine/scene/scene-accessors.service';

@Component({
  selector: 'kiddo-console-scene',
  templateUrl: './console-scene.component.html',
  styleUrls: ['./console-scene.component.scss'],
  providers: [Destroyed]
})
export class ConsoleSceneComponent implements OnInit {
  consoleContent: string[];
  tabs: string[] = [];
  variables: ConsoleVariable[];
  private prefixPath = 'SCENE.CONSOLE.';
  @Input() isStatic: boolean;

  private consoleSceneReader: ConsoleReaderService;
  private sceneAccessorsService: SceneAccessorsService;
  constructor(
    @Self() private destroyed: Destroyed,
    private scriptRunnerService: ScriptRunnerService,
  ) {
    this.sceneAccessorsService = new SceneAccessorsService();
    this.consoleSceneReader = this.sceneAccessorsService.reader as ConsoleReaderService;
  }

  ngOnInit(): void {
    this.tabs.push(`${this.prefixPath}OUTPUT`);

    this.variables = this.isStatic ? this.getImmutableVariables() : this.consoleSceneReader.getVariablesList();

    this.consoleContent = this.consoleSceneReader.consoleContent;

    // TODO this logic shouldn't be in component! Move it to script-runner or some other service it belongs to
    this.scriptRunnerService.executionState.pipe(
      tap(state => {
        if (state === scriptExecutionState.READY) {
          this.variables = this.isStatic ? this.variables : this.consoleSceneReader.getVariablesList();
          this.consoleContent = this.consoleSceneReader.consoleContent;
        }
      }),
      takeUntil(this.destroyed)
    ).subscribe();
  }

  getImmutableVariables(): ConsoleVariable[] {
    const variables = [];
    for (const variable of this.consoleSceneReader.getVariablesList()) {
      variables.push({...variable});
    }
    return variables;
  }

}
