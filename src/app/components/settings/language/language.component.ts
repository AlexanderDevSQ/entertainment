import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { StorageService } from 'src/app/services/storage.service';
import { IonButton, IonContent, IonCardContent, IonCard, IonLabel, IonImg, IonCardHeader } from "@ionic/angular/standalone";
import { DataService } from 'src/app/services/data.service';
import { Language } from 'src/app/interfaces/Language';
import { Router } from '@angular/router';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  standalone: false
})
export class LanguageComponent  implements OnInit {

  languages : Language[] = [];
  selectedLanguage: Language = {
    code: '',
    name: '',
    flag: ''
  };


  constructor(
    private storageService: StorageService,
    private modalController: ModalController,
    private notificationService: NotificationsService,
    private translateService: TranslateService,
    private dataService: DataService,
    private router: Router
  ) { }


  dismiss(){
    this.modalController.dismiss();
  }

  ngOnInit() {
    this.dataService.getLanguages().subscribe((lang: Language[]) => {
      this.languages = lang;
    })
    this.storageService.get('lang').then((lang) => {
      this.selectedLanguage = lang;
    })
  }

  submit( language: Language ){
    this.selectedLanguage = language;
    this.storageService.set('lang', this.selectedLanguage);
    this.translateService.use(this.selectedLanguage.code);
    this.notificationService.displayNotification(this.translateService.instant('modals.changeLanguage'), 4000, 'top', 'checkmark-circle-outline', 'success');
    this.dismiss();
  }

}
