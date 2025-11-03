import { Injectable } from '@angular/core';
import { Datum } from 'src/app/interfaces/Anime';
import { StorageService } from './storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  private animeKey = 'animes';
  private animeSubject = new BehaviorSubject<Datum[]>([]);
  animes$ = this.animeSubject.asObservable();

  constructor(private storageService: StorageService) {}

  async storeAnimes(animes: Datum[]) {
    await this.storageService.set(this.animeKey, animes);
    this.animeSubject.next(animes);
  }

  async getAnimes(): Promise<Datum[]> {
    const animes = await this.storageService.get(this.animeKey);
    return animes ? animes : [];
  }

  async getAnime(animeId: string): Promise<Datum | undefined> {
    const animes = await this.getAnimes();
    return animes.find(anime => anime.mal_id.toString() === animeId);
  }

  async addAnime(newAnime: Datum) {
    let animes = await this.getAnimes();
    animes.push(newAnime);
    await this.storeAnimes(animes);
  }

  async removeAnime(animeId: string) {
    let animes = await this.getAnimes();
    animes = animes.filter(anime => anime.mal_id.toString() !== animeId);
    await this.storeAnimes(animes);
  }

  async updateAnime(animeId: string, anime : Datum) {
    let animes = await this.getAnimes();
    const index = animes.findIndex(anime => anime.mal_id.toString() === animeId);
    if (index !== -1) {
      animes[index] = anime;
      await this.storeAnimes(animes);
    }
  }
}
