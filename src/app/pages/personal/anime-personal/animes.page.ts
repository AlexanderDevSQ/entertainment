import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { map } from 'rxjs';
import { RateEntertainmentComponent } from 'src/app/components/rate-entertainment/rate-entertainment.component';
import { Datum } from 'src/app/interfaces/Anime';
import { RequestsService } from 'src/app/services/requests.service';
import { AnimeService } from 'src/app/services/storage-data/anime.service';

@Component({
  selector: 'app-animes',
  templateUrl: './animes.page.html',
  styleUrls: ['./animes.page.scss'],
  standalone: false
})
export class AnimesPage implements OnInit {

  animesOnRequest: Datum[] = [];
  page: number = 1;
  searchExpr : string = '';
  animes : Datum[] = [];
  isInfiniteScrollDisabled = false;

  constructor(
    private requestService: RequestsService,
    private navController: NavController,
    private modalController: ModalController,
    private animeService: AnimeService,
  ) { }

  ngOnInit() {  
      this.loadStoredAnimes();
  }


  //#region Search Animes Segment

  searchAnimes ( event?: any ) {
    const searchExpr = event.target.value?.toLowerCase() || '';
    this.searchExpr = searchExpr;
    if (!searchExpr.trim() && searchExpr.length === 0) {
      this.animesOnRequest = [];
      this.page = 1;
      return;
    }
  
    this.requestService.getAnimesBySearch(this.searchExpr, this.page.toString())
      .subscribe((response) => {
        this.animesOnRequest = [...this.animesOnRequest, ...response.data];
      });
    // this.animes = this.originalAnimes.filter(anime =>
    //   anime.title_english?.toLowerCase().includes(searchExpr)
    // );
    // this.loadedPages.clear();
    // this.page = 1;
  }

  getStateColor(state: string | undefined): string {
    switch (state) {
      case 'Not Started':
        return 'danger';
      case 'Watching':
        return 'warning';
      case 'Completed':
        return 'success';
      default:
        return 'medium'; // fallback
    }
  }
  
  onIonInfinite(event: any) {
    console.log('Loading more data...');
    this.page++;
    this.requestService.getAnimesBySearch(this.searchExpr, this.page.toString())
    .subscribe((response) => {
      this.animesOnRequest = [...this.animesOnRequest, ...response.data];
    });
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }
  
  detailAnime(anime: Datum) {
    this.navController.navigateForward('/detail/anime-detail', {
      animated: true,
      animationDirection: 'forward', // or 'back'
      state: { anime }
    }); 
  }
  
  //#endregion Search Animes Segment
  //#region My Animes Segment
  loadStoredAnimes ( ) {
      this.animeService.getAnimes().then((animes) => {
        this.animes = animes.filter((anime, index, self) =>
          index === self.findIndex(a => a.mal_id === anime.mal_id)
      );
    });
  }
  doRefresh( event: any) {
    setTimeout(() => {
      this.loadStoredAnimes();
      event.target.complete();
    }, 500);
  }

  async rateAnime( anime: Datum ) {
    const modal = await this.modalController.create({
      component: RateEntertainmentComponent,
    });
  
    await modal.present();
  
    const { data } = await modal.onWillDismiss();
    if (data) {
      const rating = data.data;
      if (anime.personal) {
        anime.personal.personal_rating = rating.toString();
      }
      this.animeService.updateAnime(anime.mal_id.toString(), anime);
    }
  }

}
