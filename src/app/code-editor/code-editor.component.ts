import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { AceConfigInterface, AceComponent } from 'ngx-ace-wrapper';
import { StorageService } from '../shared/services';
import { CodeEditorService } from './code-editor-service/code-editor.service';
import { fromEvent } from 'rxjs';
import { debounceTime, filter, takeUntil, tap } from 'rxjs/operators';
import { CodeSaverService } from './code-saver/code-saver.service';
import { Destroyed } from '../shared/services/destroyed.service';
import { SceneType } from '../../app-engine/scene/common/models/scene-type.enum';

@Component({
  selector: 'kiddo-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
})
export class CodeEditorComponent implements AfterViewInit {
  @ViewChild('aceComponent') aceComponent: AceComponent;

  editorConfig: AceConfigInterface = {
    fontSize: '16px',
    mode: 'python',
  };
  sceneType = SceneType;
  prefixPath = 'CODE-EDITOR.';

  constructor(
    public codeEditorService: CodeEditorService,
    private storageService: StorageService,
    private codeSaverService: CodeSaverService,
    private destroyed: Destroyed,
  ) {
  }

  ngAfterViewInit(): void {
    this.codeEditorService.aceEditorInstance = this.aceComponent.directiveRef.ace();

    fromEvent(this.codeEditorService.aceEditorInstance, 'change').pipe(
      filter(Boolean),
      debounceTime(500),
      tap(_ => this.cacheCodeToLocalStorage()),
      takeUntil(this.destroyed),
    ).subscribe();
  }

  private cacheCodeToLocalStorage(): void {
    this.storageService.setLocalStorageItem(this.getDefaultSolutionName(), this.codeEditorService.userCode);
  }

  private getDefaultSolutionName(): string {
    return this.codeSaverService.getSolutionNameFromUrl();
  }
}
