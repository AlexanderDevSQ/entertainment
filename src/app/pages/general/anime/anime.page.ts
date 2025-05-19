import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { map } from 'rxjs';
import { Anime, Datum } from 'src/app/interfaces/Anime';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-anime',
  templateUrl: './anime.page.html',
  styleUrls: ['./anime.page.scss'],
  standalone: false
})
export class AnimePage implements OnInit {

  animes : Datum[] = [];
  originalAnimes : Datum[] = [];
  page: number = 1;
  loadedPages: Set<number> = new Set();
  isLoaded: boolean = false;
  searchExpr : string = '';



  constructor(
    private requestService : RequestsService,
    private navController : NavController,
  ) { }


  filterAnimes(searchTerm: string) {
    const searchExpr = searchTerm.toLowerCase().trim();
  
    if (!searchExpr) {
      this.animes = this.originalAnimes;
      this.searchExpr = '';
      return;
    }
  
    this.searchExpr = searchExpr;
    this.loadedPages.clear();
  
    this.requestService.getAnimesBySearch(this.searchExpr, this.page.toString())
      .subscribe((response) => {
        this.animes = [...response.data]; 
        this.page++;
      });
  }

  searchOnValue( event : any ) {
    const value = event.target.value || '';
    this.filterAnimes(value);
  }
  
  async loadAnimes() {
    if (this.searchExpr === '') {
      if (this.loadedPages.has(this.page)) return;
  
      this.isLoaded = false;
  
      this.requestService.getTopAnimes(this.page)
        .pipe(
          map((response) => {
            const animes = response.data;
            return animes.filter((anime, index, self) =>
              index === self.findIndex(a => a.mal_id === anime.mal_id)
            );
          })
        )
        .subscribe((filteredAnimes) => {
          this.animes = [...this.animes, ...filteredAnimes];
          this.originalAnimes = [...this.animes];
          this.loadedPages.add(this.page);
          this.isLoaded = true;
        });
  
    } else {
      this.filterAnimes(this.searchExpr); 
    }
  }
  
  async ngOnInit() {
    await this.loadAnimes();
  }

  nextPage() {
    this.page++;
    this.loadAnimes();
  }
  
  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  get pageAnimes() {
    const pageSize = 25;
    const start = (this.page - 1) * pageSize;
    return this.animes.slice(start, start + pageSize);
  }

  detailAnime(anime: Datum) {
    this.navController.navigateForward('/detail/anime-detail', {
      animated: true,
      animationDirection: 'forward', // or 'back'
      state: { anime }
    }); 
  }
}
