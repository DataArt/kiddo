import { Component, OnInit, Self, Input } from '@angular/core';
import { delay, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ScriptRunnerService } from '../../../app-engine/script-runner/script-runner.service';
import { scriptExecutionState } from '../../../app-engine/script-runner/script-runner.types';
import { Destroyed } from '../../shared/services';
import { GameObject, Player, Tile, CustomeTile } from '../../../app-engine/scene/raccoon/entities';
import { SceneType } from '../../../app-engine/scene/common/models/scene-type.enum';
import { RaccoonReaderService } from '../../../app-engine/scene/raccoon/readers/raccoon-reader.service';
import { RaccoonWriterService } from '../../../app-engine/scene/raccoon/writers/raccoon-writer.service';
import { SceneAccessorsService } from '../../../app-engine/scene/scene-accessors.service';
import { KiddoInitService } from '../../kiddo-init.service';

@Component({
  selector: 'kiddo-raccoon-scene',
  templateUrl: './raccoon-scene.component.html',
  styleUrls: ['./raccoon-scene.component.scss'],
  providers: [Destroyed]
})
export class RaccoonSceneComponent implements OnInit {
  // TODO this should PROBABLY be hooked up from scene-model.service.ts, not re-declared here
  sceneType: SceneType;
  compulsoryItems: GameObject[];
  customTiles: CustomeTile[];
  gameField: Tile[][];
  gameObjects: GameObject[] = [];
  player: Player;
  playerInventory: GameObject[];
  terraIncognita: boolean;
  @Input() isStatic: boolean;

  private tileSceneReader: RaccoonReaderService;
  private playerWriter: RaccoonWriterService;

  private sceneAccessorsService: SceneAccessorsService;

  constructor(
    @Self() private destroyed: Destroyed,
    private scriptRunnerService: ScriptRunnerService,
    private kiddoInitService: KiddoInitService,
  ) {
    this.sceneAccessorsService = new SceneAccessorsService();
  }

  ngOnInit(): void {
    // hook up to scene accessors
    this.tileSceneReader = this.sceneAccessorsService.reader as RaccoonReaderService;
    this.playerWriter = this.sceneAccessorsService.writer as RaccoonWriterService;

    // wait for init to finish,
    this.kiddoInitService.isLoaded.pipe(
      filter(Boolean),
      // then switch to script-runner's execution state
      switchMap(() => this.scriptRunnerService.executionState),
      // Whenever execution state is ready for running, update current scene model
      tap(state => {
        if (state === scriptExecutionState.READY) {
          this.isStatic ? this.getImmutableModel() : this.getModel();
          this.terraIncognita = this.tileSceneReader.terraIncognitaIsOn();
        }
      }),
      // and after 500ms check if this game step was the last one
      delay(500),
      tap(state => {
        if (state === scriptExecutionState.FINISHED) this.handleScriptFinish();
      }),
      takeUntil(this.destroyed)
    ).subscribe();
  }

  private handleScriptFinish(): void {
    this.playerWriter.handlePlayerStateOnCompletion();
  }

  private getModel(): void {
    this.sceneType = this.tileSceneReader.getSceneType();
    this.player = this.tileSceneReader.getPlayer();
    this.gameField = this.tileSceneReader.getGameField();
    this.gameObjects = this.tileSceneReader.getGameObjects();
    this.compulsoryItems = this.tileSceneReader.getCompulsoryGameObjects();
    this.playerInventory = this.player.inventory;
    this.customTiles = this.tileSceneReader.getCustomTiles();
  }

  private getImmutableModel(): void {
    this.sceneType = this.tileSceneReader.getSceneType();
    this.player = {...this.tileSceneReader.getPlayer(), position: {...this.tileSceneReader.getPlayer().position}};
    this.gameField = this.tileSceneReader.getGameField();
    this.gameObjects = [];
    for (const obj of this.tileSceneReader.getGameObjects()) {
      this.gameObjects.push({...obj, position: {...obj.position}});
    }
    this.compulsoryItems = this.tileSceneReader.getCompulsoryGameObjects();
    this.playerInventory = this.player.inventory;
    this.customTiles = this.tileSceneReader.getCustomTiles();
  }
}
