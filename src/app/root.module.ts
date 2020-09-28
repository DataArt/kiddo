import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, DoBootstrap } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { KiddoComponent } from './kiddo.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CodeEditorModule } from './code-editor/code-editor.module';
import { SceneModule } from './scene/scene.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MarkdownModule } from 'ngx-markdown';
import { SharedModule } from './shared/shared.module';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { ScenetypeFormComponent } from './task-editor/scenetype-form/scenetype-form.component';
import { DescriptionFormComponent } from './task-editor/description-form/description-form.component';
import { InitialCodeFormComponent } from './task-editor/initial-code-form/initial-code-form.component';
import { SaveFormComponent } from './task-editor/save-form/save-form.component';
import { TaskEditorComponent } from './task-editor/task-editor.component';
import { TestLaunchComponent } from './task-editor/test-launch/test-launch.component';
import { GamePlayerComponent } from './game-player/game-player.component';
import { ApiTestingComponent } from './api-testing/api-testing.component';
import { environment } from '../environments/environment';
import { TaskEditorHelpComponent } from './task-editor/task-editor-help/task-editor-help.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './kiddo-routing.module';
import { Router } from '@angular/router';
import { AngularResizedEventModule } from 'angular-resize-event';

declare const assetsPath: string;

@NgModule({
  declarations: [
    KiddoComponent,
    ScenetypeFormComponent,
    DescriptionFormComponent,
    InitialCodeFormComponent,
    SaveFormComponent,
    TaskEditorComponent,
    TestLaunchComponent,
    GamePlayerComponent,
    ApiTestingComponent,
    TaskEditorHelpComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    CodeEditorModule,
    SceneModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MarkdownModule.forRoot({ loader: HttpClientModule }),
    SharedModule,
    ClipboardModule,
    FormsModule,
    AngularResizedEventModule
  ]})
export class RootModule implements DoBootstrap {
  constructor(private injector: Injector, private router: Router) { }

  ngDoBootstrap(): void {

    applyCustomAssetsPath();
    if (customElements.get('kiddo-player') == null) {
      const customElement = createCustomElement(KiddoComponent, { injector: this.injector });
      customElements.define('kiddo-player', customElement);
    }

    this.router.initialNavigation();
  }
}

function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, `${environment.assetsPath}/i18n/`, `.json?timestamp=${Date.now()}`);
}

function applyCustomAssetsPath(): void {
  try {
    environment.assetsPath = assetsPath;
  } catch (error) {
    console.log(error);
  }
}
