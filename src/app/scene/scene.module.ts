import { NgModule } from '@angular/core';
import { PropertyFilterPipe } from '../shared/pipes/property-filter.pipe';
import { SceneComponent } from './scene.component';
import { RaccoonSceneComponent } from './raccoon-scene/raccoon-scene.component';
import { ConsoleSceneComponent } from './console-scene/console-scene.component';
import { GameFieldComponent } from './raccoon-scene/game-field/game-field.component';
import { RaccoonTileRowComponent } from './raccoon-scene/game-field/raccoon-tile-row/raccoon-tile-row.component';
import { PandemicTileRowComponent } from './pandemic-scene/game-field/pandemic-tile-row/pandemic-tile-row.component';
import { PlayerComponent } from './raccoon-scene/player/raccoon-player.component';
import { RaccoonComponent } from './raccoon-scene/player/raccoon/raccoon.component';
import { InventoryComponent } from './raccoon-scene/inventory/inventory.component';
import { GameObjectsComponent } from './raccoon-scene/game-objects/game-objects.component';
import { GameObjectComponent } from './raccoon-scene/game-objects/game-object/game-object.component';
import {
  ExcludeGameObjectsTypesPipe,
  GameObjectCoordinatePipe,
  QuoteStringPipe,
  SnakeToKebabCasePipe
} from './common/pipes';
import { RaccoonStatisticsComponent } from './raccoon-scene/raccoon-statistics/raccoon-statistics.component';
import { ConsoleStatisticsComponent } from './console-scene/console-statistics/console-statistics.component';
import { ConsoleToolbarComponent } from './console-scene/console-toolbar/console-toolbar.component';
import { SharedModule } from '../shared/shared.module';
import { PandemicSceneComponent } from './pandemic-scene/pandemic-scene.component';
import { PandemicStatisticsComponent } from './pandemic-scene/pandemic-statistics/pandemic-statistics.component';
import { GameObjectImageDirective, GameFieldMaxWidthDirective } from './common/directives';
import { PandemicGameFieldComponent } from './pandemic-scene/game-field/game-field.component';
import { PandemicGameObjectsComponent } from './pandemic-scene/game-objects/game-objects.component';
import { PandemicInventoryComponent } from './pandemic-scene/inventory/inventory.component';
import { PandemicPlayerComponent } from './pandemic-scene/player/pandemic-player.component';
import { PandemicHeroComponent } from './pandemic-scene/player/pandemic-hero/pandemic-hero.component';
import { RaccoonTileClassDirective } from './raccoon-scene/directives/raccoon-tile-class.directive';
import { PandemicTileClassDirective } from './pandemic-scene/directives/raccoon-tile-class.directive';
import { PandemicGameObjectComponent } from './pandemic-scene/game-objects/game-object/game-object.component';
import { GameObjectCellSizePipe } from './raccoon-scene/pipes/game-field-cell-size.pipe';
import { PandemicGameObjectCellSizePipe } from './pandemic-scene/pipes/game-field-cell-size.pipe';


@NgModule({
  declarations: [
    SceneComponent,
    RaccoonSceneComponent,
    ConsoleSceneComponent,
    ConsoleToolbarComponent,
    GameFieldComponent,
    RaccoonTileRowComponent,
    PlayerComponent,
    RaccoonComponent,
    InventoryComponent,
    GameObjectsComponent,
    GameObjectComponent,
    PropertyFilterPipe,
    GameObjectCellSizePipe,
    PandemicGameObjectCellSizePipe,
    GameObjectCoordinatePipe,
    SnakeToKebabCasePipe,
    QuoteStringPipe,
    ExcludeGameObjectsTypesPipe,
    RaccoonTileClassDirective,
    PandemicTileClassDirective,
    RaccoonStatisticsComponent,
    ConsoleStatisticsComponent,
    GameObjectImageDirective,
    GameFieldMaxWidthDirective,
    PandemicSceneComponent,
    PandemicGameFieldComponent,
    PandemicTileRowComponent,
    PandemicGameObjectsComponent,
    PandemicStatisticsComponent,
    PandemicPlayerComponent,
    PandemicHeroComponent,
    PandemicInventoryComponent,
    PandemicGameObjectComponent
  ],
  exports: [
    SceneComponent,
  ],
  imports: [
    SharedModule,
  ]
})
export class SceneModule { }
