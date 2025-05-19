import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import Menu from '../interfaces/Menu';
import Tab from '../interfaces/Tab';

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
}
