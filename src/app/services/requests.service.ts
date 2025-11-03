import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { Anime } from '../interfaces/Anime';
import { Videogame } from '../interfaces/Videogame';
import { SerieResult, Serie, Genre, GenreSeries } from '../interfaces/Serie';
import { GenreMovies, MovieResult } from '../interfaces/Movie';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class RequestsService {



  private API_KEY_GAMES : string | undefined = 'c1d567766f2a41ec8d77e266ab52c5de';
  private API_KEY_FILMS_SERIES : string | undefined = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOWQ0NTZlOTVlZWE1Y2Y4ZjU0NjBjNWY0YWM5MDk3MiIsIm5iZiI6MS43MzkxODM2MTAwODcwMDAxZSs5LCJzdWIiOiI2N2E5ZDVmYTZjYTgxNTQ2MDQwZjc3MDkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.OmR4W4j0_ENGucegQDGygNdPXMg9217eeuP61fLI7WY';
  private base_url_games : string = 'https://api.rawg.io/api/games';
  private base_url_anime : string = 'https://api.jikan.moe/v4';
  private base_url_films_series : string = 'https://api.themoviedb.org/3';
  private base_local_url : string = 'https://entertainment-backend-l8pk.onrender.com';

  constructor(
    private http: HttpClient,
    private storageService : StorageService
  ) { }

  async getLanguage(): Promise<any> {
    const res = await this.storageService.get('lang');
    console.log(res);
    return res;
  }


  getHeadersFilmsSeries() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.API_KEY_FILMS_SERIES}`,
      'Content-Type': 'application/json;charset=utf-8',
    });
  }

  getTopAnimes ( page: number = 1) : Observable<Anime> {
    return this.http.get<Anime>(`${this.base_url_anime}/top/anime?page=${page}&filter=airing&limit=10&sfw=true`);
  }

  getAnimesBySearch ( search : string, page : string ) : Observable<Anime> {
    return this.http.get<Anime>(`${this.base_url_anime}/anime?q=${search}&sfw=true&page=${page}`);
  }

  getTopVideogames ( page : number = 1, pageSize = 10) : Observable<any> {
    return this.http.get<Videogame>(`${this.base_local_url}/games?page=${page}&pageSize=${pageSize}`);
  }

  getVideogamesBySearch ( search : string, page : number = 1, pageSize = 10) : Observable<any> {
    return this.http.get<Videogame>(`${this.base_local_url}/search?query=${search}&page=${page}&pageSize=${pageSize}`);
  }

  getTopSeries ( page: number = 1) : Observable<SerieResult>{
    return from(this.getLanguage()).pipe(
      switchMap(lang =>
        this.http.get<SerieResult>(
          `${this.base_url_films_series}/tv/top_rated?language=${lang.code}&page=${page}`,
          { headers: this.getHeadersFilmsSeries() }
        )
      )
    );
  }

  getSeriesBySearch ( search : string, page : number ) : Observable<SerieResult> {
    return from(this.getLanguage()).pipe(
      switchMap(lang =>
        this.http.get<SerieResult>(
          `${this.base_url_films_series}/search/tv?query=${search}&language=${lang.code}&page=${page}`,
          { headers: this.getHeadersFilmsSeries() }
        )
      )
    );
  }

  getGenresSeries () : Observable<GenreSeries> {
    return from(this.getLanguage()).pipe(
      switchMap(lang =>
        this.http.get<GenreSeries>(
          `${this.base_url_films_series}/genre/tv/list?language=${lang.code}`,
          { headers: this.getHeadersFilmsSeries() }
        )
      )
    );
  }

  getGenresMovies () : Observable<GenreMovies> {
    return from(this.getLanguage()).pipe(
      switchMap(lang =>
        this.http.get<GenreMovies>(
          `${this.base_url_films_series}/genre/movie/list?language=${lang.code}`,
          { headers: this.getHeadersFilmsSeries() }
        )
      )
    );
  }

  getTopMovies(page: number = 1): Observable<MovieResult> {
  return from(this.getLanguage()).pipe(
    switchMap(lang =>
      this.http.get<MovieResult>(
        `${this.base_url_films_series}/movie/top_rated?language=${lang.code}&page=${page}`,
        { headers: this.getHeadersFilmsSeries() }
      )
    )
  );
}

  getMoviesBySearch ( search : string, page : number ) : Observable<MovieResult> {
    return from(this.getLanguage()).pipe(
      switchMap(lang =>
        this.http.get<MovieResult>(
          `${this.base_url_films_series}/search/movie?query=${search}&language=${lang.code}&page=${page}`,
          { headers: this.getHeadersFilmsSeries() }
        )
      )
    );
  }






}
