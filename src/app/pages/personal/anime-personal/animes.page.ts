import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { map } from 'rxjs';
import { RateEntertainmentComponent } from 'src/app/components/rate-entertainment/rate-entertainment.component';
import { Datum } from 'src/app/interfaces/Anime';
import { AnimeService } from 'src/app/services/anime.service';
import { RequestsService } from 'src/app/services/requests.service';

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
  subscription: any;
  isInfiniteScrollDisabled = false;
  noResults: boolean = false

  constructor(
    private requestService: RequestsService,
    private navController: NavController,
    private modalController: ModalController,
    private animeService: AnimeService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
      this.loadStoredAnimes();
  }

  ionViewWillEnter(){
    this.loadStoredAnimes();
    this.subscription = this.animeService.animes$.subscribe(animes => {
      this.animes = animes.filter(m => m.personal)
    });
  }

  ionViewWillLeave(){
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  resetPage() {
    this.noResults = false;
    this.animesOnRequest = [];
    this.page = 1;
    this.searchExpr = '';
  }

  //#region Search Animes Segment

  async searchAnimes ( event?: any ) {


    const searchExpr = event.target.value?.toLowerCase() || '';
    this.searchExpr = searchExpr;
    if (!searchExpr.trim() && searchExpr.length === 0) {
      this.animesOnRequest = [];
      this.page = 1;
      return;
    }
    this.noResults = false;

    this.requestService.getAnimesBySearch(this.searchExpr, this.page.toString())
      .subscribe((response) => {
        this.animesOnRequest = [...this.animesOnRequest, ...response.data];
        if (response.data.length === 0) {
          this.noResults = true;
        }
      });
    // this.animes = this.originalAnimes.filter(anime =>
    //   anime.title_english?.toLowerCase().includes(searchExpr)
    // );
    // this.loadedPages.clear();
    // this.page = 1;
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

  onIonInfinite(event: any) {
    this.page++;
    this.requestService.getAnimesBySearch(this.searchExpr, this.page.toString())
    .subscribe((response) => {
      if (response.data.length === 0) {
        this.noResults = true;
        return;
      }
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

  onInfiniteScroll(){
    if (this.noResults) {
      return;
    }
    this.page++;
    this.requestService.getAnimesBySearch(this.searchExpr, this.page.toString())
      .subscribe((response) => {
        if (response.data.length === 0) {
          this.noResults = true;
          return;
        }
        this.animesOnRequest = [...this.animesOnRequest, ...response.data];
      });

  }

  

}
