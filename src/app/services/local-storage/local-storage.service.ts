import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  saveToStorage<T>(key : string, item:T | T[]) : void {
    localStorage.setItem(key, JSON.stringify(item))
  }

  loadFromStorage<T>(key : string) : T | T[] {
    const item : string | null = localStorage.getItem(key)
    return JSON.parse(item || '')
  }
}
