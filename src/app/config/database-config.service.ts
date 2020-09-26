import { Injectable } from '@angular/core';
import { DatabaseConfig } from './config.interface';

@Injectable({
  providedIn: 'root'
})
export class DatabaseConfigService {

  private databaseConfig: DatabaseConfig;

  constructor() {
  }

  setDatabaseConfiguration(databaseConfig: DatabaseConfig): void {
    this.databaseConfig = databaseConfig;
  }

  getDatabaseConfiguration(): DatabaseConfig {
    return this.databaseConfig;
  }

}
