import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { RateEntertainmentComponent } from 'src/app/components/rate-entertainment/rate-entertainment.component';
import { Datum } from 'src/app/interfaces/Anime';
import { AnimeService } from 'src/app/services/anime.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-anime-detail',
  templateUrl: './anime-detail.page.html',
  styleUrls: ['./anime-detail.page.scss'],
  standalone: false
})
export class AnimeDetailPage implements OnInit {

  anime!: Datum;
  showFullText: boolean = false;
  availableStates: string[] = ['personal.status.notStarted', 'personal.status.watching', 'personal.status.completed', 'personal.status.onHold', 'personal.status.dropped'];
  currentLang: string = ''

  toggleText() {
    this.showFullText = !this.showFullText;
  }

  constructor(
    private router: Router,
    private animeService: AnimeService,
    private notificationService: NotificationsService,
    private modalController: ModalController,
    private translateService : TranslateService,
    private storageService: StorageService

  ) { }

  ngOnInit() {
    this.storageService.get('lang').then((lang : any) => {
      if (lang) {
        this.currentLang = lang.code;
      }
    })
    const navigation = this.router.getCurrentNavigation();
    this.anime = navigation?.extras.state?.['anime'];
    this.animeService.getAnime(this.anime.mal_id.toString()).then(anime => {
      if (anime) {
        this.anime = anime;
      }
    });
  }

  watchTrailer( url : string | null ) {
    window.open(url!, '_blank');
  }

  handleAnimeSave( anime: Datum, isSaved: boolean | undefined ) {
    if (isSaved) {
      this.animeService.removeAnime(anime.mal_id.toString());
      this.anime.personal = undefined;
      this.anime.isSaved = false;
      this.notificationService.displayNotification(this.translateService.instant('modals.animeDeleteConfirm'), 2000, 'top', 'alert-circle-outline', 'danger');
      return;
    }
    this.anime.isSaved = true;
    this.anime.personal = { personal_rating: null, state: 'personal.status.notStarted' };
    this.animeService.addAnime(anime);
    this.notificationService.displayNotification(this.translateService.instant('modals.animeSubmitConfirm'), 2000, 'top', 'checkmark-circle-outline', 'success');
  }

  getStateColor(state: string | undefined): string {
    switch (state) {
      case 'personal.status.notStarted':
        return 'danger';
      case 'personal.status.watching':
        return 'warning';
      case 'personal.status.completed':
        return 'success';
      case 'personal.status.onHold':
        return 'tertiary';
      case 'personal.status.dropped':
        return 'medium';
      default:
        return 'medium';
    }
  }

  changeState() {
    if (this.anime.personal) {
      const currentIndex = this.availableStates.indexOf(this.anime.personal.state || 'personal.status.notStarted');
      const nextIndex = (currentIndex + 1) % this.availableStates.length;
      const nextState = this.availableStates[nextIndex];

      this.anime.personal.state = nextState;
      this.animeService.updateAnime(this.anime.mal_id.toString(), this.anime);

      return { mal_id: this.anime.mal_id, state: nextState };
    }

    return { mal_id: this.anime.mal_id, state: undefined };
  }

  async editRating( anime: Datum ) {
    const modal = await this.modalController.create({
          component: RateEntertainmentComponent,
        });

        await modal.present();

        const { data } = await modal.onWillDismiss();
        if (data) {
          const rating = data.data;
          if (anime.personal) {
            anime.personal.personal_rating = rating.toString();
          }
          this.animeService.updateAnime(anime.mal_id.toString(), anime);
        }
  }

}
