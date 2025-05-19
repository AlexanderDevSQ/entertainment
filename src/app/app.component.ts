import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private navController: NavController
  ) {}

  ngOnInit(): void {
    this.platform.backButton.subscribeWithPriority(10, () => {
      if ( window.history.length > 1 ) {
        this.navController.back();
        return;
      } else{
        App.exitApp();
      }
    });
    
  }
}
