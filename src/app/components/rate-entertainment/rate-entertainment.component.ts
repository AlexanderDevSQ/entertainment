import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { NotificationsService } from 'src/app/services/notifications.service';
import { AnimeService } from 'src/app/services/storage-data/anime.service';

@Component({
  selector: 'app-rate-entertainment',
  templateUrl: './rate-entertainment.component.html',
  styleUrls: ['./rate-entertainment.component.scss'],
  imports: [IonicModule, CommonModule ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RateEntertainmentComponent{

  ratings = Array.from({ length: 10 }, (_, i) => i + 1);
  selectedRating: number | null = null;

  constructor(
    private modalCtrl: ModalController,
    private animeService: AnimeService,
    private notificationService: NotificationsService,
  ) {}

  select(event: any) {
    const num = parseInt(event.target.value, 10);
    this.selectedRating = num;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  submit() {
    this.notificationService.displayNotification('Rating submitted successfully', 2000, 'top', 'checkmark-circle-outline', 'success');
    this.modalCtrl.dismiss({
      data: this.selectedRating,
    });
  }

}
