import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
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


  constructor(
    private requestService: RequestsService,
    private navController: NavController,
    private modalController: ModalController,
    private serieService: SeriesService,
  ) { }
  
  ngOnInit() {
    this.loadStoredSeries();
  }

  searchSeries ( event?: any ) {
    const searchExpr = event.target.value?.toLowerCase() || '';
    this.searchExpr = searchExpr;
    if (!searchExpr.trim() && searchExpr.length === 0) {
      this.seriesOnRequest = [];
      this.page = 1;
      return;
    }
  
    this.requestService.getSeriesBySearch(this.searchExpr, this.page)
      .subscribe((response) => {
        this.seriesOnRequest = [...this.seriesOnRequest, ...response.results];
      });
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
  onInfiniteScroll(event: any) {
    this.page++;
    this.requestService.getSeriesBySearch(this.searchExpr, this.page)
      .subscribe((response) => {
        this.seriesOnRequest = [...this.seriesOnRequest, ...response.results];
      });
    setTimeout(() => {
      event.target.complete();
    }, 500);

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
