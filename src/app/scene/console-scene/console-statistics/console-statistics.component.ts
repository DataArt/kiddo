import { Component, Input, OnInit } from '@angular/core';
import { GameStatistics, StatisticsItem } from '../../../../app-engine/scene/common/entities';
import { GameStatisticsService } from '../../common/game-statistics.service';

@Component({
  selector: 'kiddo-console-statistics',
  templateUrl: './console-statistics.component.html',
  styleUrls: ['./console-statistics.component.scss'],
})
export class ConsoleStatisticsComponent implements OnInit {
  @Input() statistics: GameStatistics;
  statisticsItemsList: StatisticsItem[] = [];
  prefixPath = 'SCENE-COMPONENT.CONSOLE-STATISTICS.';
  private excludedStatisticsFields = ['gameFinished', 'levelPassed'];

  constructor(private gameStatisticsService: GameStatisticsService) { }

  ngOnInit(): void {
    this.statisticsItemsList = this.getGameStatisticsAsList(this.statistics);
  }

  private getGameStatisticsAsList(statisticsObject: GameStatistics): StatisticsItem[] {
    const gameStatisticsList: StatisticsItem[] = [];

    for (const [key, value] of Object.entries(statisticsObject)) {
      if (this.excludedStatisticsFields.includes(key)) {
        continue;
      }

      const statisticsItem: StatisticsItem = {
        name: this.gameStatisticsService.convertToSnakeCase(key).toUpperCase(),
        value: this.gameStatisticsService.deriveStatisticsItemValue(value, this.prefixPath)
      };

      gameStatisticsList.push(statisticsItem);
    }

    return gameStatisticsList;
  }
}
