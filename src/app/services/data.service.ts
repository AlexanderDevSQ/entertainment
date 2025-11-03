import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import Menu from '../interfaces/Menu';
import Tab from '../interfaces/Tab';
import { Setting } from '../interfaces/Setting';
import { Language } from '../interfaces/Language';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient,
  ) { }

  getSidebarMenus () : Observable<Menu[]> {
    return this.http.get<Menu[]>('/assets/data/sidebar.json');
  }

  getTabs() : Observable<Tab[]> {
    return this.http.get<any[]>('/assets/data/tabs.json');
  }

  getSettings() : Observable<Setting[]> {
    return this.http.get<Setting[]>('/assets/data/settings.json');
  }

  getLanguages() : Observable<Language[]> {
    return this.http.get<Language[]>('/assets/data/languages.json');
  }
}
