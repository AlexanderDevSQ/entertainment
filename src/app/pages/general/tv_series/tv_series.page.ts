import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { map, Observable } from 'rxjs';
import { Serie } from 'src/app/interfaces/Serie';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-tv-series',
  templateUrl: './tv_series.page.html',
  styleUrls: ['./tv_series.page.scss'],
  standalone: false,

})
export class TvSeriesPage implements OnInit {

  series : Serie[] = [];
  originalSeries: Serie[] = [];
  page: number = 1;
  loadedPages: Set<number> = new Set();
  isLoaded: boolean = false;
  searchExpr : string = '';
  noResponse: boolean = false

  constructor(
    private requestService: RequestsService,
    private navController: NavController,
    private loadingController: LoadingController
  ) { }

  ionViewDidLeave	(){
    this.searchExpr = ''
    this.loadSeries();
    this.noResponse = false;
    this.page = 1
  }



  async filterSeries ( searchTerm: string ) {
    this.noResponse = false
    this.series = []
    const searchExpr = searchTerm.toLowerCase().trim();



    if (!searchExpr) {
      this.series = this.originalSeries;
      this.searchExpr = '';
      return;
    }

    this.searchExpr = searchExpr;
    this.loadedPages.clear();

    this.requestService.getSeriesBySearch(this.searchExpr, this.page).subscribe(async (response) => {
      if ( response.results.length == 0) {
        this.noResponse = true;
        return;
      }
      this.series = response.results;
    });

  }

  searchOnValue ( event : any ) {
    this.page = 1;
    const value = event.target.value || '';
    this.filterSeries(value);

  }

  async loadSeries() {

      this.isLoaded = false;

      const loading = await this.loadingController.create({
      });

      loading.present();

      this.requestService.getTopSeries(this.page)
        .pipe(
          map((response) => {
            const series = response.results;
            if ( response.results.length == 0) {
              this.noResponse = true;
              loading.dismiss();
              return [];
            }
            return series.filter((serie, index, self) =>
              index === self.findIndex(s => s.id === serie.id)
            );
          })
        ).subscribe((filteredSeries) => {
          this.series = filteredSeries;
          this.originalSeries = filteredSeries;
          this.loadedPages.add(this.page);
          this.isLoaded = true;
          loading.dismiss();
        });
  }

  async ngOnInit(): Promise<void> {
    await this.loadSeries();
  }

  nextPage() {
    this.series = [];
    this.page++;
    if ( this.searchExpr != ''){
      this.filterSeries(this.searchExpr);
    } else {
      this.loadSeries();
    }
  }

  prevPage() {
    this.noResponse = false;
    this.series = [];
    if (this.page > 1) {
      this.page--;
      if (this.searchExpr != ''){
        this.filterSeries(this.searchExpr);
      } else {
        this.loadSeries();
      }
    }
  }

  resetPage(){
    this.noResponse = false;
    this.series = [];
    this.page = 1;
    this.loadSeries();
    this.searchExpr = '';
  }

  get pageSeries () {
    const pageSize = 10;
    const start = (this.page - 1) * pageSize;
    return this.series.slice(start, start + pageSize);
  }

  detailSerie ( serie: Serie) {
    console.log(serie);
    this.navController.navigateForward('/detail/serie-detail', {
      animated: true,
      animationDirection: 'forward', // or 'back'
      state: { serie }
    });
  }


}
