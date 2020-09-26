import { Injectable } from '@angular/core';
import { safeDump } from 'js-yaml';

@Injectable({
  providedIn: 'root'
})
export class FileExportService {

  constructor() { }

  exportAsYamlFile(data: any): void {
    const blob = new Blob([data], {type : 'application/yaml'});

    const anchor = document.createElement('a');

    const url = window.URL.createObjectURL(blob);

    anchor.href = url;
    anchor.download = 'task.yaml';
    anchor.click();

    window.URL.revokeObjectURL(url);
    anchor.remove();
  }


  exportAsJsonFile(data: string): void {

    const blob = new Blob([data], {type : 'application/json'});

    const anchor = document.createElement('a');

    const url = window.URL.createObjectURL(blob);

    anchor.href = url;
    anchor.download = 'task.json';
    anchor.click();

    window.URL.revokeObjectURL(url);
    anchor.remove();
  }
}
