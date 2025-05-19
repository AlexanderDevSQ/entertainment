import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
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
  availableStates: string[] = ['Not Started', 'Watching', 'Completed', 'On Hold', 'Dropped'];
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
  ) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.serie = navigation?.extras.state?.['serie'];
    this.getGenres();
  }

  watchTrailer( url : string | null ) {
    window.open(url!, '_blank');
  }

  handleSerieSave( serie: Serie, isSaved: boolean | undefined ) {
    if (isSaved) {
      this.seriesService.removeSerie(serie.id.toString());
      this.serie.personal = undefined;
      this.serie.isSaved = false;
      this.notificationService.displayNotification('Serie removed successfully from your list', 2000, 'top', 'alert-circle-outline', 'danger');
      return;
    }
    this.serie.isSaved = true;
    this.serie.personal = { personal_rating: null, state: 'Not Started' };
    this.seriesService.addSerie(serie);
    this.notificationService.displayNotification('Serie added successfully to your list', 2000, 'top', 'checkmark-circle-outline', 'success');
  }

  getStateColor(state: string | undefined): string {
    switch (state) {
      case 'Not Started':
        return 'danger';
      case 'Watching':
        return 'warning';
      case 'Completed':
        return 'success';
      case 'On Hold':
        return 'tertiary';
      case 'Dropped':
        return 'danger';
      default:
        return 'medium';
    }
  }

  changeState() {
    if (this.serie.personal) {
      const currentIndex = this.availableStates.indexOf(this.serie.personal.state || 'Not Started');
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
