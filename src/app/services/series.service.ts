import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Serie } from '../interfaces/Serie';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  private seriesKey = 'series'; 
  
    constructor(private storageService: StorageService) {}
  
    async storeSeries(series: any[]) {
      await this.storageService.set(this.seriesKey, series);
    }
  
    async getSeries(): Promise<any[]> {
      const series = await this.storageService.get(this.seriesKey);
      return series ? series : []; 
    }
  
    async addSerie(serie: any) {
      let series = await this.getSeries();
      series.push(serie); 
      await this.storeSeries(series);  
    }
  
    async removeSerie(serieId: string) {
      let series = await this.getSeries();
      series = series.filter(serie => serie.id != serieId); 
      await this.storeSeries(series); 
    }
  
    async updateSerie(serieId: string, serie : Serie) {
      let series = await this.getSeries();
      const index = series.findIndex(serie => serie.id == serieId); 
      if (index != -1) {
        series[index] = serie;
        await this.storeSeries(series);
      }
    }
}
