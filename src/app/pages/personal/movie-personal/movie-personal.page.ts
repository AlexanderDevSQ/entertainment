import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
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


  constructor(
    private requestService : RequestsService,
    private navController: NavController,
    private modalController: ModalController,
    private movieService: MovieService,
  ) { }

  ngOnInit() {
    this.loadStoredMovies();
  }

  searchMovies ( event: any ) {
    const searchExpr = event.target.value?.toLowerCase() || '';
    this.searchExpr = searchExpr;
    if (!searchExpr.trim() && searchExpr.length === 0 ) {
      this.moviesOnRequest = [];
      this.page = 1;
      return;
    }

    this.requestService.getMoviesBySearch(this.searchExpr, this.page)
      .subscribe((response => {
        this.moviesOnRequest = [...response.results];
      }))
      
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
        return 'medium';
      case 'Dropped':
        return 'dark';
      default:
        return 'primary';
    }
  }

  onInfiniteScroll ( event : any ) {
    this.page++;
    this.requestService.getMoviesBySearch(this.searchExpr, this.page)
      .subscribe((response) => {
        this.moviesOnRequest = [...this.moviesOnRequest, ...response.results]
      });
    setTimeout(() => {
      event.target.complete();
    }, 500);
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
