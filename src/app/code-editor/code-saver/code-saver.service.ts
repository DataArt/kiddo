import { Injectable } from '@angular/core';
import { ConfigurationService } from '../../config/configuration.service';
import { Solution } from 'src/app/code-editor/code-saver/code-saver.types';
import { IDBPDatabase, openDB } from 'idb';

@Injectable({
  providedIn: 'root'
})
export class CodeSaverService {
  db: IDBPDatabase;

  constructor(private configService: ConfigurationService) {
    this.connectDb().then(db => this.db = db);
  }

  async connectDb(): Promise<IDBPDatabase> {
    const config = this.configService.getDatabaseConfiguration();

    return await openDB(config.name, config.version, {
      upgrade(db: IDBPDatabase): void {
        if (!db.objectStoreNames.contains('solutions')) {
          db.createObjectStore('solutions', {
            keyPath: 'id',
            autoIncrement: true
          })
          .createIndex('name', 'name', { unique: true });
        }
      }
    });
  }

  async saveSolution(code: string, name?: string): Promise<void> {
    const solutionName = name || await this.getDefaultSolutionName();

    const userSolution = {
      name: solutionName,
      code,
    };

    await this.db.add('solutions', userSolution);
  }

  deleteSolutions(deletedSolutions: Solution[]): void {
    deletedSolutions.forEach(async solution => await this.db.delete('solutions', solution.id));
  }

  async getSolutions(): Promise<Solution[]> {
    return await this.db.getAll('solutions');
  }

  async updateSolutionName(solution: Solution, newSolutionName: string): Promise<void> {
    const updatedSolution = { id: solution.id, name: newSolutionName, code: solution.code };
    await this.db.put('solutions', updatedSolution);
  }

  async getDefaultSolutionName(): Promise<string> {
    const nameFromUrl = this.getSolutionNameFromUrl();
    const defaultSuffixRegexp = /\(\d*\)/;
    const solutionsWithDefaultName: Solution[] = await this.db.getAllFromIndex(
      'solutions',
      'name',
      IDBKeyRange.bound(nameFromUrl, nameFromUrl + defaultSuffixRegexp)
    );

    if (solutionsWithDefaultName.length > 0) {
      const lastName = solutionsWithDefaultName.slice(-1)[0].name;

      const lastNameHasSuffix = lastName.lastIndexOf('(') > 0;

      let suffixNumber = lastNameHasSuffix
        ? +lastName.substring(lastName.indexOf('(') + 1, lastName.indexOf(')'))
        : 0;
      suffixNumber++;

      const suffix = suffixNumber < 10
        ? '0' + suffixNumber.toString()
        : suffixNumber.toString();
      return `${nameFromUrl} (${suffix})`;
    }

    return nameFromUrl;
  }

  getSolutionNameFromUrl(): string {
    const url = new URL(window.location.href);
    const taskPath = url.pathname.slice(1);
    const hostName = url.hostname;
    return taskPath || hostName;
  }
}
