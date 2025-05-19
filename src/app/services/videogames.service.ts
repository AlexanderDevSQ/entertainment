import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Videogame } from '../interfaces/Videogame';

@Injectable({
  providedIn: 'root'
})
export class VideogamesService {

  private videogamesKey = 'videogames'; 
      
        constructor(private storageService: StorageService) {}
      
        async storedVideogames(videogames: any[]) {
          await this.storageService.set(this.videogamesKey, videogames);
        }
      
        async getVideogames(): Promise<any[]> {
          const videogames = await this.storageService.get(this.videogamesKey);
          return videogames ? videogames : []; 
        }
      
        async addVideogame(videogame: any) {
          let videogames = await this.getVideogames();
          videogames.push(videogame); 
          await this.storedVideogames(videogames);  
        }
      
        async removeVideogame(videogameId: string) {
          let videogames = await this.getVideogames();
          videogames = videogames.filter(videogame => videogame.id != videogameId); 
          await this.storedVideogames(videogames); 
        }
      
        async updateVideogame(videogameId: string, videogame : Videogame) {
          let videogames = await this.getVideogames();
          const index = videogames.findIndex(videogame => videogame.id == videogameId); 
          if (index != -1) {
            videogames[index] = videogame;
            await this.storedVideogames(videogames);
          }
        }
}
