import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setLocalStorageItem(item: string, value: string): void {
    localStorage.setItem(item, value);
  }

  getLocalStorageItem(item: string): any {
    return localStorage.getItem(item);
  }

  removeLocalStorageItem(item: string): void {
    localStorage.removeItem(item);
  }
}
