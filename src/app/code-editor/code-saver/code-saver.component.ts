import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CodeSaverService } from 'src/app/code-editor/code-saver/code-saver.service';
import { Solution } from 'src/app/code-editor/code-saver/code-saver.types';
import { ContextmenuDirective } from '../../shared/directives/contextmenu/contextmenu.directive';
import { ModalDirective } from '../../shared/directives/modal/modal.directive';
import { GoogleAnalyticsService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'kiddo-code-saver',
  templateUrl: './code-saver.component.html',
  styleUrls: ['./code-saver.component.scss'],
})
export class CodeSaverComponent implements OnInit {

  @Output() loadCode = new EventEmitter<string>();
  @Output() closeModal = new EventEmitter<void>();

  @ViewChild('deletionWarningModal') deletionWarningModal: ModalDirective;

  solutions: Solution[];

  selectedCode = '';

  prefixPath = 'CODE-SAVER.';

  get selectedSolutions(): Solution[] {
    return this.solutions?.filter(solution => solution.isSelected);
  }

  constructor(
    private codeSaverService: CodeSaverService,
    private googleAnalyticsService: GoogleAnalyticsService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.solutions = await this.codeSaverService.getSolutions() as Solution[];
  }

  onLoadClick(): void {
    if (this.selectedCode) this.loadCode.emit(this.selectedCode);
    this.closeModal.emit();
  }

  onCloseClick(): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'code-saver: close_click');
    this.closeModal.emit();
  }

  onSolutionClick(solution: Solution): void {
    this._highlightOnly(solution);
    this._selectOnly(solution);
    this._stopEditingExcept(solution);

  }

  onSolutionCtrlClick(solution: Solution): void {
    if (!solution.isSelected) {
      this._highlightOnly(solution);
      this._stopEditingExcept(solution);
      solution.isSelected = true;
    } else {
      solution.isSelected = false;
      if (solution.isHighlighted) {
        solution.isHighlighted = false;
        this.selectedCode = '';
      }
    }
  }

  onSolutionShiftClick(solution: Solution): void {
    this.solutions.forEach(item => item.isSelected = false);

    const previousSolution = this.solutions.find(item => item.isHighlighted);

    const currentIndex = this.solutions.indexOf(solution);
    const previousIndex = this.solutions.indexOf(previousSolution);

    let selectionStart: number;
    let selectionEnd: number;

    if (currentIndex > previousIndex) {
      selectionStart = previousIndex;
      selectionEnd = currentIndex;
    } else {
      selectionStart = currentIndex;
      selectionEnd = previousIndex;
    }

    const selection = this.solutions.slice(selectionStart, selectionEnd + 1);
    selection.forEach(item => item.isSelected = true);

    this._highlightOnly(solution);
  }

  async onContextmenuDeleteClick(menuToClose: ContextmenuDirective, event: Event): Promise<void> {
    event.stopPropagation();
    menuToClose.close();
    this.deletionWarningModal.open();
  }

  onInlineEditClick(solution: Solution): void {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'code-saver: inline_edit_click');
    this._startEditingOnly(solution);
  }

  async onDeletionSubmit(): Promise<void> {
    this._deleteSolutions(this.selectedSolutions);
    this.solutions = await this.codeSaverService.getSolutions() as Solution[];
    this.deletionWarningModal.close();
  }

  async onSolutionRenameSubmit(solution: Solution, newName: string): Promise<void> {
    this.googleAnalyticsService.emitEvent(environment.googleAnalytics.events.buttonClick, 'code-saver: solution_rename_submit_click');
    await this.codeSaverService.updateSolutionName(solution, newName);
    this.solutions = await this.codeSaverService.getSolutions() as Solution[];
    solution.isBeingEdited = false;
  }

  private _selectOnly(solution: Solution): void {
    this.solutions.forEach(item => item.isSelected = false);
    solution.isSelected = true;
  }

  private _highlightOnly(solution: Solution): void {
    this.solutions.forEach(item => item.isHighlighted = false);
    solution.isHighlighted = true;
    this.selectedCode = solution.code;
  }

  private _startEditingOnly(solution: Solution): void {
    this.solutions.forEach(item => item.isBeingEdited = false);
    solution.isBeingEdited = true;
  }

  private _stopEditingExcept(solution: Solution): void {
    this.solutions.forEach(item => {
      if (item !== solution) item.isBeingEdited = false;
    });
  }

  private _deleteSolutions(solutions: Solution[]): void {
    this.codeSaverService.deleteSolutions(solutions);
    this.selectedCode = '';
  }
}
