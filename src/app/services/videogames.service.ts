import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Videogame } from '../interfaces/Videogame';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideogamesService {

  private videogamesKey = 'videogames';
  private videogamesSubject = new BehaviorSubject<Videogame[]>([]);
  videogames$ = this.videogamesSubject.asObservable();

        constructor(private storageService: StorageService) {}

        async storedVideogames(videogames: Videogame[]) {
          await this.storageService.set(this.videogamesKey, videogames);
          this.videogamesSubject.next(videogames);
        }

        async getVideogames(): Promise<Videogame[]> {
          const videogames = await this.storageService.get(this.videogamesKey);
          return videogames ? videogames : [];
        }

        async addVideogame(videogame: any) {
          let videogames = await this.getVideogames();
          videogames.push(videogame);
          await this.storedVideogames(videogames);
        }

         async getVideogame(videogameId: string): Promise<Videogame | undefined> {
          const videogames = await this.getVideogames();
          return videogames.find(videogame => videogame.id.toString() === videogameId);
        }


        async removeVideogame(videogameId: string) {
          let videogames = await this.getVideogames();
          videogames = videogames.filter(videogame => videogame.id.toString() !== videogameId);
          await this.storedVideogames(videogames);
        }

        async updateVideogame(videogameId: string, videogame : Videogame) {
          let videogames = await this.getVideogames();
          const index = videogames.findIndex(videogame => videogame.id.toString() === videogameId);
          if (index !== -1) {
            videogames[index] = videogame;
            await this.storedVideogames(videogames);
          }
        }
}
