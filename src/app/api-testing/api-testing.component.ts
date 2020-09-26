import { Component, OnInit } from '@angular/core';
import { ApiTestingService } from '../shared/services/api-testing.service';
import { ConfigurationService } from '../config/configuration.service';
import { safeLoad } from 'js-yaml';
import { SceneConfig } from 'src/app-engine/scene/common/scene-config';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'kiddo-api-testing',
  templateUrl: './api-testing.component.html',
  styleUrls: ['./api-testing.component.scss']
})
export class ApiTestingComponent implements OnInit {

  currentDirectory: string;
  previousDirectory: string;
  nextDirectory: string;

  previousConfigExists: boolean;
  nextConfigExists: boolean;
  description: string;
  sceneConfigLoaded: boolean;
  noConfig: boolean;

  constructor(
    private configService: ConfigurationService,
    private apiTesting: ApiTestingService,
    private route: ActivatedRoute
    ) { }

  async ngOnInit(): Promise<void> {

    this.route.paramMap.pipe(
      switchMap(params => params.getAll('id'))
  )
  .subscribe(data => {
    this.currentDirectory = data;
    this.previousDirectory = this.getFormattedDirectory(+this.currentDirectory - 1);
    this.nextDirectory = this.getFormattedDirectory(+this.currentDirectory + 1);
    this.initLoading();
  });

  }

  getFormattedDirectory(unformattedDirectory: number): string {
    let result: string = unformattedDirectory.toString();
    while (result.length < 3) {
      result  = '0' + result;
    }
    return result;
  }

  async processSiblingConfigsLoading(): Promise<void> {
    try {
      await this.apiTesting.getTestDescriptionObj(this.previousDirectory);
      this.previousConfigExists = true;
    } catch (e) {
      this.previousConfigExists = false;
    }

    try {
      await this.apiTesting.getTestDescriptionObj(this.nextDirectory);
      this.nextConfigExists = true;
    } catch (e) {
      this.nextConfigExists = false;
    }
  }

  async initLoading(): Promise<void> {
    try {
      const sceneTestConfig = safeLoad(await this.apiTesting.getTestConfig(this.currentDirectory)) as SceneConfig;
      const descriptionObj = await this.apiTesting.getTestDescriptionObj(this.currentDirectory);
      this.description = descriptionObj.description;

      this.configService.setSceneConfig(sceneTestConfig);

      this.sceneConfigLoaded = true;
    } catch (e) {
      this.noConfig = true;
    }

    this.processSiblingConfigsLoading();
  }

}
