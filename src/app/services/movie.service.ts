import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { Movie } from '../interfaces/Movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private moviesKey = 'movies';
  private moviesSubject = new BehaviorSubject<Movie[]>([]);
  movies$ = this.moviesSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadMovies(); // load initial state
  }

  private async loadMovies() {
    const movies = await this.storageService.get(this.moviesKey);
    this.moviesSubject.next(movies || []);
  }

  private async storeMovies(movies: Movie[]) {
    await this.storageService.set(this.moviesKey, movies);
    this.moviesSubject.next(movies);
  }

  async getMovies(): Promise<Movie[]> {
    return this.moviesSubject.value;
  }

  async getMovie(movieId: string) {
    const movies = await this.getMovies();
    return movies.find(m => m.id.toString() === movieId);
  }

  async addMovie(movie: Movie) {
    const movies = await this.getMovies();
    const updated = [...movies, movie];
    await this.storeMovies(updated);
  }

  async removeMovie(movieId: string) {
    const movies = await this.getMovies();
    const updated = movies.filter(m => m.id.toString() !== movieId);
    await this.storeMovies(updated);
  }

  async updateMovie(movieId: string, movie: Movie) {
    const movies = await this.getMovies();
    const index = movies.findIndex(m => m.id.toString() === movieId);
    if (index !== -1) {
      movies[index] = movie;
      await this.storeMovies([...movies]);
    }
  }
}
