import { NgModule } from '@angular/core';
import { CodeEditorComponent } from './code-editor.component';
import { TerminalComponent } from './terminal/terminal.component';
import { CodeSaverComponent } from './code-saver/code-saver.component';
import { LanguageNativePipe } from '../shared/pipes/language-native.pipe';
import { CodeEditorToolbarComponent } from './code-editor-toolbar/code-editor-toolbar.component';
import { DropdownDirective } from '../shared/directives/dropdown/dropdown.directive';
import { DropdownToggleDirective } from '../shared/directives/dropdown/dropdown-toggle.directive';
import { DropdownMenuDirective } from '../shared/directives/dropdown/dropdown-menu.directive';
import { DropdownItemDirective } from '../shared/directives/dropdown/dropdown-item.directive';
import { SelectableItemDirective } from '../shared/directives/select/selectable-item.directive';
import { ContextmenuDirective } from '../shared/directives/contextmenu/contextmenu.directive';
import { AutofocusDirective } from '../shared/directives/select/autofocus.directive';
import { TaskComponent } from './task/task.component';
import { HelpComponent } from './help/help.component';
import { SnackbarDirective } from '../shared/directives/snackbar/snackbar.directive';
import { MarkdownModule } from 'ngx-markdown';
import { ACE_CONFIG, AceConfigInterface, AceModule } from 'ngx-ace-wrapper';
import 'brace';
import 'brace/mode/python';
import 'brace/theme/tomorrow_night_eighties';
import 'brace/theme/iplastic';
import { SharedModule } from '../shared/shared.module';

const DEFAULT_ACE_CONFIG: AceConfigInterface = {
  fontSize: 16,
  theme: 'tomorrow_night_eighties',
  printMargin: 140
};

@NgModule({
  declarations: [
    CodeEditorComponent,
    TerminalComponent,
    CodeSaverComponent,
    CodeEditorToolbarComponent,
    LanguageNativePipe,
    DropdownDirective,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    SelectableItemDirective,
    ContextmenuDirective,
    AutofocusDirective,
    TerminalComponent,
    TaskComponent,
    HelpComponent,
    SnackbarDirective,
  ],
  exports: [
    CodeEditorComponent,
    TerminalComponent,
    AceModule,
    MarkdownModule
  ],
  imports: [
    SharedModule,
    MarkdownModule,
    AceModule
  ],
  providers: [
    {
      provide: ACE_CONFIG,
      useValue: DEFAULT_ACE_CONFIG
    },
  ]
})
export class CodeEditorModule { }
