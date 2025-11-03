import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { map } from 'rxjs';
import { Videogame } from 'src/app/interfaces/Videogame';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-videogames',
  templateUrl: './videogames.page.html',
  styleUrls: ['./videogames.page.scss'],
  standalone: false
})
export class VideogamesPage implements OnInit {

  videogames : Videogame[] = [];
  originalVideogames : Videogame[] = [];
  page: number = 1;
  loadedPages: Set<number> = new Set();
  isLoaded: boolean = false;
  searchExpr : string = '';
  isInfiniteScrollDisabled = false;
  noResponse : boolean = false;

  nextPage() {
    this.videogames = [];
    this.page++;
    if ( this.searchExpr != '') {
      this.filterVideogames(this.searchExpr)
    } else {
      this.loadVideogames();
    }
  }

  prevPage() {
    this.noResponse = false;
    this.videogames = [];
    console.log(this.page)
    if (this.page > 1) {
      this.page--;
      if ( this.searchExpr != '') {
        this.filterVideogames(this.searchExpr)
      } else {
        this.loadVideogames();
      }
    }
  }

  resetPage(){
    this.noResponse = false;
    this.videogames = []
    this.page = 1;
    this.loadVideogames();
    this.searchExpr = '';
  }


  get pageVideogames() {
    const pageSize = 10;
    const start = (this.page - 1) * pageSize;
    return this.videogames.slice(start, start + pageSize);
  }

  constructor(
    private requestService : RequestsService,
    private navController: NavController,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    await this.loadVideogames();

  }

  ionViewDidLeave	(){
    this.searchExpr = ''
    this.loadVideogames();
    this.noResponse = false;
    this.page = 1
  }

  async filterVideogames(searchTerm: string) {
    this.noResponse = false
    this.videogames = []

    const loading = await this.loadingController.create({
    });

    loading.present();

    const searchExpr = searchTerm.toLowerCase().trim();

    if (!searchExpr) {
      this.videogames = this.originalVideogames;
      this.searchExpr = '';
      loading.dismiss();
      return;
    }

    this.searchExpr = searchExpr;
    this.loadedPages.clear();

    this.requestService.getVideogamesBySearch(this.searchExpr, this.page, 10)
      .subscribe(async (response: any) => {
        if ( response.length == 0) {
               this.noResponse = true;
               loading.dismiss();
               return;
        }
        this.videogames = response;
        loading.dismiss();
      });
  }

  async loadVideogames() {


    this.isLoaded = false;


    const loading = await this.loadingController.create({
    });

    loading.present();

    this.requestService.getTopVideogames(this.page, 10)
      .pipe(
        map((response) => {
          const videogames = response ?? [];
          console.log(response)
          if ( response.length == 0) {
               this.noResponse = true;
               loading.dismiss();
               return [];
          }
          loading.dismiss();
          return videogames
            .filter((videogame: Videogame, index: number, self: Videogame[]) =>
              index === self.findIndex((a: Videogame) => a.id === videogame.id)
            )
            .map((videogame: Videogame) => {

              if (videogame.cover?.url) {
                videogame.cover.url = videogame.cover.url.replace('t_thumb', 't_1080p');
                if (videogame.cover.url.startsWith('//')) {
                  videogame.cover.url = 'https:' + videogame.cover.url;
                }
              }
              return videogame;
            });

        })

      )
      .subscribe({
        next: (filteredVideogames) => {
          this.videogames = filteredVideogames;
          this.loadedPages.add(this.page);
          this.isLoaded = true;
        },
        error: (err) => {
          console.error('Error fetching games:', err);
          this.isLoaded = true;
        }
      });

}



  doRefresh(event: any) {
    console.log('Begin async operation', event);
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  detailVideogame(videogame: Videogame) {
    this.navController.navigateForward('detail/games-detail', {
      animated: true,
      animationDirection: 'forward',
      state: { videogame }
    });
  }

  searchVideogames(event : any) {
    this.page = 1;
    const value = event.target.value || '';
    this.filterVideogames(value);
  }

  onIonInfinite(event: any) {
    this.page++;
    console.log("Page: ", this.page);
  }

}
