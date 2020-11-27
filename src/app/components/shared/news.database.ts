import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dexie } from 'dexie';
import { apiKey } from './model';

@Injectable()
export class NewsDatabase extends Dexie {
  private apiKey: Dexie.Table<apiKey, number>;

  constructor(private http: HttpClient) {
    // super call for extends Dexie name of db is searchDB
    super('newsDB');
    //setup schema for v1
    this.version(1).stores({
      apiKey: '++id',
    });
    // this.search refer to the table
    this.apiKey = this.table('apiKey');
  }

  addKey(key: apiKey) {
    console.log(key);
    this.apiKey.put(key);
  }
  async getKey() {
    const counter = await this.apiKey.count();
    console.log('counter', counter)
    if (counter > 0) {
      return counter;
    }
  }
}
