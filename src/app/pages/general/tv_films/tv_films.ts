import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { map } from 'rxjs';
import { Movie } from 'src/app/interfaces/Movie';
import { RequestsService } from 'src/app/services/requests.service';


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

  constructor(
    private requestService : RequestsService,
    private navController: NavController
  ) {}

  filterMovies ( searchTerm : string ) {
    const searchExpr = searchTerm.toLowerCase().toString();
    
    if (!searchExpr) {
      this.movies = this.originalMovies;
      this.searchExpr = '';
      return;
    }

    this.searchExpr = searchExpr;
    this.loadedPages.clear();

    this.requestService.getMoviesBySearch(this.searchExpr, this.page)
      .subscribe((response) => {
        this.movies = [...response.results];
        this.page++;
      });
  }

  searchOnValue( event : any ) {
    const value = event.target.value || '';
    this.filterMovies(value);
  }

  async loadMovies ( ) {
    if (this.searchExpr == '') {
      if (this.loadedPages.has(this.page)) return;

      this.isLoaded = false;

      this.requestService.getTopMovies(this.page)
        .pipe(
          map((response => {
            const movies = response.results;
            return movies.filter((movie, index, self) =>
              index === self.findIndex(m => m.id == movie.id));
          }))
        ).subscribe((filteredMovies) => {
          this.movies = [...this.movies, ...filteredMovies];
          this.originalMovies = [...this.movies];
          this.loadedPages.add(this.page);
          this.isLoaded = true;
        });

    } else {
      this.filterMovies(this.searchExpr);
    }
  }

  async ngOnInit(): Promise<void> {
    await this.loadMovies();
  }


  nextPage() {
    this.page++;
    this.loadMovies();
  }
  prevPage() {
    if (this.page > 1 ) {
      this.page--;
      this.loadMovies();
    }
  }

  get pageMovies () {
    const pageSize = 25;
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
