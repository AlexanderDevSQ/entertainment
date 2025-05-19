import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Movie } from '../interfaces/Movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private moviesKey = 'movies'; 
    
      constructor(private storageService: StorageService) {}
    
      async storeMovies(movies: any[]) {
        await this.storageService.set(this.moviesKey, movies);
      }
    
      async getMovies(): Promise<any[]> {
        const movies = await this.storageService.get(this.moviesKey);
        return movies ? movies : []; 
      }
    
      async addMovie(movie: any) {
        let movies = await this.getMovies();
        movies.push(movie); 
        await this.storeMovies(movies);  
      }
    
      async removeMovie(movieId: string) {
        let movies = await this.getMovies();
        movies = movies.filter(movie => movie.id != movieId); 
        await this.storeMovies(movies); 
      }
    
      async updateMovie(movieId: string, movie : Movie) {
        let movies = await this.getMovies();
        const index = movies.findIndex(movie => movie.id == movieId); 
        if (index != -1) {
          movies[index] = movie;
          await this.storeMovies(movies);
        }
      }
}
