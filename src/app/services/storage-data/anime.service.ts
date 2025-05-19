import { Injectable } from '@angular/core';
import { StorageService } from '../storage.service';
import { Datum } from 'src/app/interfaces/Anime';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  private animeKey = 'animes'; 

  constructor(private storageService: StorageService) {}

  async storeAnimes(animes: any[]) {
    await this.storageService.set(this.animeKey, animes);
  }

  async getAnimes(): Promise<any[]> {
    const animes = await this.storageService.get(this.animeKey);
    return animes ? animes : []; 
  }

  async addAnime(newAnime: any) {
    let animes = await this.getAnimes();
    animes.push(newAnime); 
    await this.storeAnimes(animes);  
  }

  async removeAnime(animeId: string) {
    let animes = await this.getAnimes();
    animes = animes.filter(anime => anime.mal_id != animeId); 
    await this.storeAnimes(animes); 
  }

  async updateAnime(animeId: string, anime : Datum) {
    let animes = await this.getAnimes();
    const index = animes.findIndex(anime => anime.mal_id == animeId); 
    if (index != -1) {
      animes[index] = anime;
      await this.storeAnimes(animes);
    }
  }
}
