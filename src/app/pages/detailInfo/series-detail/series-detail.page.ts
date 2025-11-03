import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { RateEntertainmentComponent } from 'src/app/components/rate-entertainment/rate-entertainment.component';
import { Genre, Serie } from 'src/app/interfaces/Serie';
import { NotificationsService } from 'src/app/services/notifications.service';
import { RequestsService } from 'src/app/services/requests.service';
import { SeriesService } from 'src/app/services/series.service';

@Component({
  selector: 'app-series-detail',
  templateUrl: './series-detail.page.html',
  styleUrls: ['./series-detail.page.scss'],
  standalone: false
})
export class SeriesDetailPage implements OnInit {

  serie!: Serie;
  showFullText: boolean = false;
  availableStates: string[] = ['personal.status.notStarted', 'personal.status.watching', 'personal.status.completed', 'personal.status.onHold', 'personal.status.dropped'];
  genres: Genre[] = [];
  genreFromSeries: string[] = [];


  toggleText() {
    this.showFullText = !this.showFullText;
  }

  constructor(
    private router: Router,
    private requestService: RequestsService,
    private seriesService: SeriesService,
    private notificationService: NotificationsService,
    private modalController: ModalController,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.serie = navigation?.extras.state?.['serie'];
    this.getGenres();
    this.seriesService.getSerie(this.serie.id.toString()).then(serie => {
      if (serie) {
        this.serie = serie;
      }
    });
  }

  watchTrailer( url : string | null ) {
  }

  handleSerieSave( serie: Serie, isSaved: boolean | undefined ) {
    if (isSaved) {
      this.seriesService.removeSerie(serie.id.toString());
      this.serie.personal = undefined;
      this.serie.isSaved = false;
      this.notificationService.displayNotification(this.translateService.instant('modals.seriesDeleteConfirm'), 2000, 'top', 'alert-circle-outline', 'danger');
      return;
    }
    this.serie.isSaved = true;
    this.serie.personal = { personal_rating: null, state: 'personal.status.notStarted' };
    this.seriesService.addSerie(serie);
    this.notificationService.displayNotification(this.translateService.instant('modals.seriesSubmitConfirm'), 2000, 'top', 'checkmark-circle-outline', 'success');
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
    if (this.serie.personal) {
      const currentIndex = this.availableStates.indexOf(this.serie.personal.state || 'personal.status.notStarted');
      const nextIndex = (currentIndex + 1) % this.availableStates.length;
      const nextState = this.availableStates[nextIndex];
      this.serie.personal.state = nextState;
      this.seriesService.updateSerie(this.serie.id.toString(), this.serie);

      return { id: this.serie.id, state: nextState };
    }

    return {id : this.serie.id, state: undefined};
  }

  async editRating( serie: Serie) {
    const modal = await this.modalController.create({
              component: RateEntertainmentComponent,
            });

            await modal.present();

            const { data } = await modal.onWillDismiss();
            if (data) {
              const rating = data.data;
              if (serie.personal) {
                serie.personal.personal_rating = rating.toString();
              }
              this.seriesService.updateSerie(serie.id.toString(), serie);
            }
  }

  async getGenres() {
    this.requestService.getGenresSeries().subscribe((response) => {
      this.genres = response.genres;
    });
  }

  getGenreName(genreId: number): string {
    const genre = this.genres.find((g) => g.id === genreId);
    return genre ? genre.name : 'Unknown Genre';
  }

  getGenresFromSeries(genreIds: number[]): string[] {
    this.genreFromSeries = genreIds.map((id) => this.getGenreName(id));
    return this.genreFromSeries;
  }
}
