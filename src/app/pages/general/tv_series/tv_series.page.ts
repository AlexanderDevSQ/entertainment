import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
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

  constructor(
    private requestService: RequestsService,
    private navController: NavController,
  ) { }



  filterSeries ( searchTerm: string ) {
    const searchExpr = searchTerm.toLowerCase().trim();

    if (!searchExpr) {
      this.series = this.originalSeries;
      this.searchExpr = '';
      return;
    }

    this.searchExpr = searchExpr;
    this.loadedPages.clear();

    this.requestService.getSeriesBySearch(this.searchExpr, this.page).subscribe((response) => {
      this.series = [...response.results]; 
      this.page++;
    });

  }

  searchOnValue ( event : any ) {
    const value = event.target.value || '';
    this.filterSeries(value);

  }

  async loadSeries() {
    if (this.searchExpr === '') {
      if (this.loadedPages.has(this.page)) return;

      this.isLoaded = false;

      this.requestService.getTopSeries(this.page)
        .pipe(
          map((response) => {
            const series = response.results;
            return series.filter((serie, index, self) =>
              index === self.findIndex(s => s.id === serie.id)
            );
          })
        ).subscribe((filteredSeries) => {
          this.series = [...this.series, ...filteredSeries];
          this.originalSeries = [...this.series];
          this.loadedPages.add(this.page);
          this.isLoaded = true;
        });
    } else{

      this.filterSeries(this.searchExpr);
    }
  }

  async ngOnInit(): Promise<void> {
    await this.loadSeries();
  }

  nextPage() {
    this.page++;
    this.loadSeries();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadSeries();
    }
  }

  get pageSeries () {
    const pageSize = 25;
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
