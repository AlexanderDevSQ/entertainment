import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { map } from 'rxjs';
import { Datum } from 'src/app/interfaces/Anime';
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
  noResponse: boolean = false;



  constructor(
    private requestService : RequestsService,
    private navController : NavController,
    private loadingController : LoadingController
  ) { }

  ionViewDidLeave	(){
    this.searchExpr = ''
    this.loadAnimes();
    this.noResponse = false;
    this.page = 1
  }

  async filterAnimes(searchTerm: string) {

    this.noResponse = false;
    this.animes = []
    const searchExpr = searchTerm.toLowerCase().trim();



    if (!searchExpr) {
      this.animes = this.originalAnimes;
      this.searchExpr = '';
      return;
    }

    this.searchExpr = searchExpr;
    this.loadedPages.clear();

    this.requestService.getAnimesBySearch(this.searchExpr, this.page.toString())
      .subscribe(async (response : any) => {


        if (response.data.length == 0) {
          this.noResponse = true;
          return;
        }
        this.animes = response.data;
    });
  }

  searchOnValue( event : any ) {
    this.page = 1;
    const value = event.target.value || '';
    this.filterAnimes(value);
  }

  async loadAnimes() {
    this.isLoaded = false;

    const loading = await this.loadingController.create({
        });

    loading.present();

    this.requestService.getTopAnimes(this.page)
      .pipe(
        map((response) => {
          if ( response.data.length == 0) {
               this.noResponse = true;
          }
          const animes = response.data;
          loading.dismiss();
          return animes.filter((anime, index, self) =>
            index === self.findIndex(a => a.mal_id === anime.mal_id)
          );
        })
      )
      .subscribe((filteredAnimes) => {
        this.animes = filteredAnimes;
        this.originalAnimes = this.animes;
        this.loadedPages.add(this.page);
        this.isLoaded = true;
      });

  }

  async ngOnInit() {
    await this.loadAnimes();
  }

  nextPage() {
    this.animes = [];
    this.page++;
    if ( this.searchExpr != '' ) {
      this.filterAnimes(this.searchExpr);
    } else {
      this.loadAnimes();
    }
  }

  prevPage() {
    this.noResponse = false;
    this.animes = [];
    if (this.page > 1) {
      this.page--;
      if ( this.searchExpr != '') {
        this.filterAnimes(this.searchExpr)
      } else {
        this.loadAnimes();
      }
    }
  }

  resetPage(){
    this.noResponse = false;
    this.animes = []
    this.page = 1;
    this.loadAnimes();
    this.searchExpr = '';
  }

  get pageAnimes() {
    const pageSize = 10;
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
