import { Injectable, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {


  private _storage: Storage | null = null;

  constructor(
    private storage: Storage,
  ) { 
    this.init();

  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }


  async set(key: string, value: any) {
    await this.storage.set(key, value);
  }
  async get(key: string) {
    return await this.storage.get(key);
  }
  async remove(key: string) {
    await this.storage.remove(key);
  }
  async clear() {
    await this.storage.clear();
  }
  async keys() {
    return await this.storage.keys();
  }
  async length() {
    return await this.storage.length();
  }

}
