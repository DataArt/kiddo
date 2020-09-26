import { Component, Input, OnInit } from '@angular/core';
import {
  RaccoonGameStatistics,
  StatisticsItem,
  PandemicGameStatistics
} from '../../../../app-engine/scene/common/entities';
import { GameStatisticsService } from '../../common/game-statistics.service';
import { SceneType } from '../../../../app-engine/scene/common/models/scene-type.enum';

@Component({
  selector: 'kiddo-pandemic-statistics',
  templateUrl: './pandemic-statistics.component.html',
  styleUrls: ['./pandemic-statistics.component.scss'],
})
export class PandemicStatisticsComponent implements OnInit {
  @Input() sceneType: string;
  @Input() statistics: RaccoonGameStatistics | PandemicGameStatistics;
  statisticsItemsList: StatisticsItem[] = [];
  prefixPath: string;
  private scenesPrefixes = {
    [SceneType.RACCOON]: 'SCENE-COMPONENT.TILE-STATISTICS.RACCOON.',
    [SceneType.PANDEMIC]: 'SCENE-COMPONENT.TILE-STATISTICS.WHO.',
  };
  private excludedStatisticsFields = ['gameFinished', 'levelPassed', 'compulsoryObjectsTotalAmount'];

  constructor(private gameStatisticsService: GameStatisticsService) {
  }

  ngOnInit(): void {
    this.prefixPath = this.scenesPrefixes[this.sceneType];
    this.statisticsItemsList = this.getGameStatisticsAsList(this.statistics);
  }

  private getGameStatisticsAsList(statisticsObject: RaccoonGameStatistics): StatisticsItem[] {
    const gameStatisticsList: StatisticsItem[] = [];

    for (const [key, value] of Object.entries(statisticsObject)) {
      if (this.excludedStatisticsFields.includes(key)) {
        continue;
      }

      const statisticsItem: StatisticsItem = {
        name: this.gameStatisticsService.convertToSnakeCase(key).toUpperCase(),
        value: this.gameStatisticsService.deriveStatisticsItemValue(value, this.prefixPath)
      };

      if (key === 'compulsoryObjectsPicked') {
        if (!statisticsObject.compulsoryObjectsTotalAmount) {
          continue;
        }

        statisticsItem.value += '/' + statisticsObject.compulsoryObjectsTotalAmount;
      }

      gameStatisticsList.push(statisticsItem);
    }

    return gameStatisticsList;
  }

}
