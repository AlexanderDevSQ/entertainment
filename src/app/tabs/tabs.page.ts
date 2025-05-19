import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import Tab from '../interfaces/Tab';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit {

  tabs: Tab[] = [];
  selectedTab: string = 'tv-shows';
  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() : void {
    this.dataService.getTabs()
      .subscribe((tabs: Tab[]) => {
        this.tabs = tabs;
      })
  }

  navigateTab(event: any) {
    const url = '/tabs/' + event.detail.value;
    this.router.navigate([url]);
  }


}
