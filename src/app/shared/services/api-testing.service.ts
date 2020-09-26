import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SceneConfig } from 'src/app-engine/scene/common/scene-config';
import { safeLoad } from 'js-yaml';

interface TestDescription {
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiTestingService {

  constructor(private http: HttpClient) { }

  getTestConfig(directory: string): Promise<string> {
    return this.http.get(`assets/api-testing/${directory}/task.yaml`, { responseType: 'text' }).toPromise();
  }

  getTestDescriptionObj(directory: string): Promise<TestDescription> {
    return this.http.get<TestDescription>(`assets/api-testing/${directory}/index.json`).toPromise();
  }
}
