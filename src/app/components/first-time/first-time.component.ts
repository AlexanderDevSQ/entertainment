import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { ComponentsModule } from '../components.module';

@Component({
  selector: 'app-first-time',
  templateUrl: './first-time.component.html',
  styleUrls: ['./first-time.component.scss'],
  standalone: false
})
export class FirstTimeComponent  implements OnInit {

  firstTime = false;

  constructor(
    private storageService: StorageService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.storageService.get('firstTime').then((res) => {
      this.firstTime = res;
    })
  }

  dismiss(){
    this.storageService.set('firstTime', true);
    this.modalController.dismiss();
  }

}
