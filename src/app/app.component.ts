import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { StorageService } from './services/storage.service';
import { FirstTimeComponent } from './components/first-time/first-time.component';
import { TranslateService } from '@ngx-translate/core';
import { StatusBar, StatusBarStyle, Style } from '@capacitor/status-bar';
import { Language } from './interfaces/Language';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private storageService: StorageService,
    private navController: NavController,
    private modalController: ModalController,
    private translateService: TranslateService
  ) {
     this.storageService.get('lang').then((lang : any) => {
          if (lang) {
            console.log('storage lang', lang)
            this.translateService.setDefaultLang(lang.code)
            this.translateService.use(lang.code);
          } else {
            this.translateService.setDefaultLang('en')
            this.translateService.use('en');
            const lang : Language = {
              code: 'en',
              name: 'English',
              flag: '🇬🇧'
            }
            this.storageService.set('lang', lang)
          }
        })
  }


  async ngOnInit() {

    this.platform.ready().then(() => {
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setOverlaysWebView({ overlay : false});
    })
    this.platform.backButton.subscribeWithPriority(10, () => {
      if ( window.history.length > 1 ) {
        this.navController.back();
        return;
      } else{
        App.exitApp();
      }
    });


  }

  openModal() {
    this.modalController.create({
      component: FirstTimeComponent,
      cssClass: 'first-time-modal',
      backdropDismiss: false,
    }).then((modal) => {
      modal.present();
    });
  }
}
