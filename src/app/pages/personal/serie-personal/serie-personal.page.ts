import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { RateEntertainmentComponent } from 'src/app/components/rate-entertainment/rate-entertainment.component';
import { Serie } from 'src/app/interfaces/Serie';
import { RequestsService } from 'src/app/services/requests.service';
import { SeriesService } from 'src/app/services/series.service';

@Component({
  selector: 'app-serie-personal',
  templateUrl: './serie-personal.page.html',
  styleUrls: ['./serie-personal.page.scss'],
  standalone: false
})
export class SeriePersonalPage implements OnInit {


  seriesOnRequest: Serie[] = [];
  page: number = 1;
  searchExpr : string = '';
  series : Serie[] = [];
  isInfiniteScrollDisabled = false;
  subscription: any;
  noResults: boolean = false;


  constructor(
    private requestService: RequestsService,
    private navController: NavController,
    private modalController: ModalController,
    private serieService: SeriesService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.loadStoredSeries();
  }

  ionViewWillEnter(){
    this.loadStoredSeries();
    this.subscription = this.serieService.series$.subscribe(series => {
      this.series = series.filter(m => m.personal)
    });
  }

  ionViewWillLeave(){
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async searchSeries ( event?: any ) {
    const loading = await this.loadingController.create({
    });

    await loading.present();

    const searchExpr = event.target.value?.toLowerCase() || '';
    this.searchExpr = searchExpr;
    if (!searchExpr.trim() && searchExpr.length === 0) {
      this.seriesOnRequest = [];
      this.page = 1;
      this.noResults = false;
      loading.dismiss();
      return;
    }

    this.requestService.getSeriesBySearch(this.searchExpr, this.page)
      .subscribe((response) => {
        this.seriesOnRequest = [...this.seriesOnRequest, ...response.results];
        if (response.results.length === 0) {
          this.noResults = true;
          loading.dismiss();
        }
        loading.dismiss();
      });
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
    this.seriesOnRequest = [];
    this.page = 1;
    this.searchExpr = '';
  }

  onInfiniteScroll(){
    this.page++;
    this.requestService.getSeriesBySearch(this.searchExpr, this.page)
      .subscribe((response) => {
        if (response.results.length === 0) {
          this.noResults = true;
          return;
        }
        this.seriesOnRequest = [...this.seriesOnRequest, ...response.results];
      });
  }

  detailSerie(serie: Serie) {
    this.navController.navigateForward('/detail/serie-detail', {
      animated: true,
      animationDirection: 'forward', // or 'back'
      state: { serie }
    });
  }

  loadStoredSeries () {
    this.serieService.getSeries().then((series) => {
      this.series = series.filter((serie, index, self) =>
        index === self.findIndex(s => s.id === serie.id));
    });
  }

  doRefresh( event: any ) {
    setTimeout(() => {
      this.loadStoredSeries();
      event.target.complete();
    }, 500);
  }

  async rateSerie ( serie: Serie) {
    const modal = await this.modalController.create({
      component: RateEntertainmentComponent
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data ) {
      const rating = data.data;
      if (serie.personal) {
        serie.personal.personal_rating = rating.toString();
      }
      this.serieService.updateSerie(serie.id.toString(), serie);
    }
  }

}
