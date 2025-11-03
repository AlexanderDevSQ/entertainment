import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { RateEntertainmentComponent } from 'src/app/components/rate-entertainment/rate-entertainment.component';
import { Movie } from 'src/app/interfaces/Movie';
import { MovieService } from 'src/app/services/movie.service';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-movie-personal',
  templateUrl: './movie-personal.page.html',
  styleUrls: ['./movie-personal.page.scss'],
  standalone: false
})
export class MoviePersonalPage implements OnInit {


  moviesOnRequest: Movie[] = [];
  page: number = 1;
  searchExpr : string = '';
  movies : Movie[] = [];
  isInfiniteScrollDisabled = false;
  noResults: boolean = false;
  subscription: any;


  constructor(
    private requestService : RequestsService,
    private navController: NavController,
    private modalController: ModalController,
    private movieService: MovieService,
    private loadingController: LoadingController
  ) { }


  ionViewWillEnter(){
    this.loadStoredMovies();
    this.subscription = this.movieService.movies$.subscribe(movies => {
      this.movies = movies.filter(m => m.personal);
    });
  }

  ionViewWillLeave(){
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.loadStoredMovies();
  }

  async searchMovies ( event: any ) {
    const loading = await this.loadingController.create({
    });

    loading.present();

    const searchExpr = event.target.value?.toLowerCase() || '';
    this.searchExpr = searchExpr;
    if (!searchExpr.trim() && searchExpr.length === 0 ) {
      this.moviesOnRequest = [];
      this.page = 1;
      loading.dismiss();
      return;


    }
    this.noResults = false;
    this.requestService.getMoviesBySearch(this.searchExpr, this.page)
      .subscribe((response => {
        if ( response.results.length === 0) {
          this.noResults = true;
          loading.dismiss();
        }
        this.moviesOnRequest = [...response.results];
        loading.dismiss();
      }))

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

  resetPage() {
    this.noResults = false;
    this.moviesOnRequest = [];
    this.page = 1;
    this.searchExpr = '';
  }

  onInfiniteScroll () {
    this.page++;
    this.requestService.getMoviesBySearch(this.searchExpr, this.page)
      .subscribe((response) => {
        if ( response.results.length === 0) {
          this.noResults = true;
          console.log(`No results found for ${this.searchExpr} ${response.results}`)
          return;
        }
        this.moviesOnRequest = [...this.moviesOnRequest, ...response.results]
      });
  }

  detailMovie ( movie: Movie) {
    this.navController.navigateForward('detail/movie-detail', {
      animated: true,
      animationDirection: 'forward',
      state: { movie }
    })
  }

  loadStoredMovies ( ) {
    this.movieService.getMovies().then((movies => {
      this.movies = movies.filter((movie, index, self) =>
        index === self.findIndex(m => m.id === movie.id));
    }));
  }

  doRefresh( event: any) {
    setTimeout(() => {
      this.loadStoredMovies();
      event.target.complete();
    }, 500);
  }


  async rateMovie ( movie: Movie) {
    const modal = await this.modalController.create({
      component: RateEntertainmentComponent
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data ) {
      const rating = data.data;
      if (movie.personal) {
        movie.personal.personal_rating = rating.toString();
      }
      this.movieService.updateMovie(movie.id.toString(), movie);
    }
  }

}
