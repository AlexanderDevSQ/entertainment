import { Component } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { filter, map } from 'rxjs';
import { Movie } from 'src/app/interfaces/Movie';
import { RequestsService } from 'src/app/services/requests.service';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-tv-films',
  templateUrl: 'tv_films.html',
  styleUrls: ['tv_films.scss'],
  standalone: false,
})
export class TvFilmsPage {

  movies : Movie[] = [];
  originalMovies: Movie[] = [];
  page: number = 1;
  loadedPages: Set<number> = new Set();
  isLoaded: boolean = false;
  searchExpr : string = '';
  noResponse : boolean = false;

  constructor(
    private requestService : RequestsService,
    private navController: NavController,
    private loadingController: LoadingController,
    private storageService: StorageService
  ) {}

  ionViewDidLeave	(){
    this.searchExpr = ''
    this.loadMovies();
    this.noResponse = false;
    this.page = 1
  }



  async filterMovies ( searchTerm : string ) {
    this.noResponse = false
    this.movies = [];
    const searchExpr = searchTerm.toLowerCase().toString();


    if (!searchExpr) {
      this.movies = this.originalMovies;
      this.searchExpr = '';
      return;
    }

    this.searchExpr = searchExpr;
    this.loadedPages.clear();

    this.requestService.getMoviesBySearch(this.searchExpr, this.page)
      .subscribe(async (response) => {
        if ( response.results.length == 0) {
          this.noResponse = true;
          return;
        }
        this.movies = response.results;
      });
  }

  searchOnValue( event : any ) {
    this.page = 1;
    const value = event.target.value || '';
    this.filterMovies(value);
  }

  async loadMovies ( ) {


      this.isLoaded = false;

      const loading = await this.loadingController.create({
      });

      loading.present();

      this.requestService.getTopMovies(this.page)
        .pipe(
          map((response => {
            console.log(response)
            if ( response.results.length == 0) {
              this.noResponse = true;
            }
            const movies = response.results;
            return movies.filter((movie, index, self) =>
              index === self.findIndex(m => m.id == movie.id));
          }))
        ).subscribe(async (filteredMovies) => {
          this.movies = filteredMovies;
          this.originalMovies = this.movies;
          this.loadedPages.add(this.page);
          this.isLoaded = true;
          loading.dismiss();
        });
  }

  async ngOnInit(): Promise<void> {
    await this.loadMovies();
  }


  nextPage() {
    this.noResponse = false;
    this.movies = [];
    this.page++;
    if (this.searchExpr != '') {
      this.filterMovies(this.searchExpr);
    } else {
      this.loadMovies();
    }
  }
  prevPage() {
    this.noResponse = false;
    this.movies = [];
    this.page--;
    if (this.searchExpr != '') {
      this.filterMovies(this.searchExpr);
    } else {
      this.loadMovies();
    }
  }

  resetPage() {
    this.noResponse = false;
    this.movies = [];
    this.page = 1;
    this.loadMovies();
    this.searchExpr = '';
  }

  get pageMovies () {
    const pageSize = 10;
    const start = (this.page - 1) * pageSize;
    return this.movies.slice(start, start + pageSize);
  }

  detailMovie( movie: Movie) {
    console.log(movie)
    this.navController.navigateForward('/detail/movie-detail', {
      animated: true,
      animationDirection: 'forward',
      state: { movie }
    });
  }
}
