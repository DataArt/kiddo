import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../shared/services';
import { I18nFactoryService } from '../../shared/services';
import { ScriptRunnerService } from '../../../app-engine/script-runner/script-runner.service';
import { CodeSaverService } from '../code-saver/code-saver.service';
import { SceneModelService } from '../../../app-engine/scene/scene-model.service';

@Injectable({
  providedIn: 'root'
})
export class CodeEditorService {
  currentSceneType: string;

  // @ts-ignore
  aceEditorInstance;

  userCode = '';

  private prefixPath = 'CODE-EDITOR.SERVICE.';
  private prefixError = this.prefixPath + 'GAME_FAIL_ERROR.';

  private sceneModelService: SceneModelService;
  constructor(
    private i18n: I18nFactoryService,
    private storageService: StorageService,
    private codeSaver: CodeSaverService,
  ) {
    this.sceneModelService = new SceneModelService();
  }

  translate = this.i18n.translate(this.prefixPath);
  translateError = this.i18n.translate(this.prefixError);

  setInitialUserScript(): void {
    if (this.sceneModelService.sceneInitialScript) {
      this.userCode = this.sceneModelService.sceneInitialScript;
    }
  }

  initialize(): void {
    this.currentSceneType = this.sceneModelService.sceneModel.sceneType;
    this.userCode = this.storageService.getLocalStorageItem(this.codeSaver.getSolutionNameFromUrl());
    if (!this.userCode) {
      this.setInitialUserScript();
    }
  }
}
