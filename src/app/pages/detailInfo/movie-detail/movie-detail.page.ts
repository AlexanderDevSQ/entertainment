import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { RateEntertainmentComponent } from 'src/app/components/rate-entertainment/rate-entertainment.component';
import { Genre, Movie } from 'src/app/interfaces/Movie';
import { MovieService } from 'src/app/services/movie.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { RequestsService } from 'src/app/services/requests.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
  standalone: false
})
export class MovieDetailPage  implements OnInit {


  movie! : Movie;
  showFullText: boolean = false;
  availableStates: string[] = ['personal.status.notStarted', 'personal.status.watching', 'personal.status.completed', 'personal.status.onHold', 'personal.status.dropped'];
  genres: Genre[] = [];
  genreFromMovies: string[] = [];

  toggleText(){
    this.showFullText = !this.showFullText;
  }

  constructor(
    private router: Router,
    private requestService: RequestsService,
    private moviesService: MovieService,
    private notificationService: NotificationsService,
    private modalController: ModalController,
    private translateService : TranslateService,
  ) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.movie = navigation?.extras.state?.['movie'];
    this.moviesService.getMovie(this.movie.id.toString()).then((movie) => {
      if (movie) {
        this.movie = movie;
      }
    });
    this.getGenres();
  }


  async getGenres() {
    this.requestService.getGenresMovies().subscribe((response : any) => {
      this.genres = response.genres;
    });
  }

  watchTrailer( url : string | null ) {
    window.open(url!, '_blank');
  }

  handleMovieSave( movie: Movie, isSaved: boolean | undefined) {
    if (isSaved) {
      this.moviesService.removeMovie(movie.id.toString());
      this.movie.personal = undefined;
      this.movie.isSaved = false;
      this.notificationService.displayNotification(this.translateService.instant('modals.movieDeleteConfirm'), 2000, 'top', 'alert-circle-outline', 'danger');
      return;
    }
    this.movie.isSaved = true;
    this.movie.personal = { personal_rating: null, state: 'personal.status.notStarted'};
    this.moviesService.addMovie(movie);
    this.notificationService.displayNotification(this.translateService.instant('modals.movieSubmitConfirm'), 2000, 'top', 'checkmark-circle-outline', 'success');
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
    if (this.movie.personal) {
      const currentIndex = this.availableStates.indexOf(this.movie.personal.state || 'personal.status.notStarted');
      const nextIndex = (currentIndex + 1) % this.availableStates.length;
      const nextState = this.availableStates[nextIndex];
      this.movie.personal.state = nextState;
      this.moviesService.updateMovie(this.movie.id.toString(), this.movie);

      return { id: this.movie.id, state: nextState };
    }

    return {id : this.movie.id, state: undefined};
  }

  async editRating( movie: Movie) {
      const modal = await this.modalController.create({
                component: RateEntertainmentComponent,
              });

              await modal.present();

              const { data } = await modal.onWillDismiss();
              if (data) {
                const rating = data.data;
                if (movie.personal) {
                  movie.personal.personal_rating = rating.toString();
                }
                this.moviesService.updateMovie(movie.id.toString(), movie);
              }
    }

  getGenreName(genreId: number): string {
    const genre = this.genres.find((g) => g.id === genreId);
    return genre ? genre.name : 'Unknown Genre';
  }

  getGenresFromMovies(genreIds: number[]): string[] {
    this.genreFromMovies = genreIds.map((id) => this.getGenreName(id));
    return this.genreFromMovies;
  }


}
