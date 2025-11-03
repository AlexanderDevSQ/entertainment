import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Serie } from '../interfaces/Serie';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  private seriesKey = 'series';
  private seriesSubject = new BehaviorSubject<Serie[]>([]);
  series$ = this.seriesSubject.asObservable();

    constructor(private storageService: StorageService) {}

    async storeSeries(series: Serie[]) {
      await this.storageService.set(this.seriesKey, series);
    }

    async getSeries(): Promise<Serie[]> {
      const series = await this.storageService.get(this.seriesKey);
      return series ? series : [];
    }

    async getSerie(serieId: string): Promise<Serie | undefined> {
      const series = await this.getSeries();
      return series.find(serie => serie.id.toString() === serieId);
    }


    async addSerie(serie: Serie) {
      let series = await this.getSeries();
      series.push(serie);
      await this.storeSeries(series);
    }

    async removeSerie(serieId: string) {
      let series = await this.getSeries();
      series = series.filter(serie => serie.id.toString() !== serieId);
      await this.storeSeries(series);
    }

    async updateSerie(serieId: string, serie : Serie) {
      let series = await this.getSeries();
      const index = series.findIndex(serie => serie.id.toString() === serieId);
      if (index !== -1) {
        series[index] = serie;
        await this.storeSeries(series);
      }
    }
}
