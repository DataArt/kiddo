import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/config/configuration.service';
import { safeDump, safeLoad } from 'js-yaml';
import { SceneConfig } from 'src/app-engine/scene/common/scene-config';
import { KiddoInitService } from 'src/app/kiddo-init.service';
import { BehaviorSubject, Subject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TaskEditorService {

  sceneType: string;
  taskDescription: string;
  initialCode: string;
  showHelpIntroduction: BehaviorSubject<boolean> = new BehaviorSubject(false);
  outputCode: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(private configService: ConfigurationService, private kiddoInitService: KiddoInitService) { }

  setSceneType(value: string): void {
    this.sceneType = value;
  }

  setTaskDescription(value: string): void {
    this.taskDescription = value;
  }

  setInitialCode(value: string): void {
    const config = {
      sceneType: this.sceneType,
      taskDescription: this.taskDescription,
      generatingFunc: value
    };

    this.outputCode.next(safeDump(config));
    this.configService.setSceneConfig(config as SceneConfig);
  }

  clearTaskEditor(): void {
    this.sceneType = null;
    this.taskDescription = null;
    this.initialCode = null;
    this.outputCode.next(null);
    this.kiddoInitService.resetApp();
  }

  setIntroductionStatus(value: boolean): void {
    this.showHelpIntroduction.next(value);
  }

  setIntroductionForbidStatus(dontShowAgain: boolean): void {
    localStorage.setItem('dontShowTaskEditorIntroduction', JSON.stringify(dontShowAgain));
  }

  getIntroductionStatus(): Observable<boolean> {
    return this.showHelpIntroduction;
  }

  initIntroductionStatus(): void {
    this.showHelpIntroduction.next(!JSON.parse(localStorage.getItem('dontShowTaskEditorIntroduction')));
  }
}
