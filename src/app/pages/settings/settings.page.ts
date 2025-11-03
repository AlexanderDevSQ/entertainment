import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LanguageComponent } from 'src/app/components/settings/language/language.component';
import { Setting } from 'src/app/interfaces/Setting';
import { DataService } from 'src/app/services/data.service';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone:false
})
export class SettingsPage implements OnInit {


  settings: Setting[] = [];

  constructor(
    private dataService: DataService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.dataService.getSettings().subscribe((settings : any) => {
      console.log(settings);
      this.settings = settings;
    })
  }

  async openLanguageModal(){
    const modal = await this.modalController.create({
        component: LanguageComponent,
    });

    await modal.present();

    
  }

  async openModal ( setting: Setting) {

    switch (setting.value) {
      case 'language':
        await this.openLanguageModal();
        break;
      default:
        break;
    }

  }


}
