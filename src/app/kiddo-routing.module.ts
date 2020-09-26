import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApiTestingComponent } from './api-testing/api-testing.component';
import { TaskEditorComponent } from './task-editor/task-editor.component';
import { GamePlayerComponent } from './game-player/game-player.component';

const routes: Routes = [
    { path: 'api-testing/:id', component: ApiTestingComponent },
    { path: 'task-editor', component: TaskEditorComponent },
    { path: '**', data: { title: 'player' }, component: GamePlayerComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
