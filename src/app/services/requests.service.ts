import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Anime } from '../interfaces/Anime';
import { Result, Videogame } from '../interfaces/Videogame';
import { SerieResult, Serie, Genre, GenreSeries } from '../interfaces/Serie';
import { GenreMovies, MovieResult } from '../interfaces/Movie';


@Injectable({
  providedIn: 'root'
})
export class RequestsService {


  
  private API_KEY_GAMES : string | undefined = 'c1d567766f2a41ec8d77e266ab52c5de';
  private API_KEY_FILMS_SERIES : string | undefined = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOWQ0NTZlOTVlZWE1Y2Y4ZjU0NjBjNWY0YWM5MDk3MiIsIm5iZiI6MS43MzkxODM2MTAwODcwMDAxZSs5LCJzdWIiOiI2N2E5ZDVmYTZjYTgxNTQ2MDQwZjc3MDkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.OmR4W4j0_ENGucegQDGygNdPXMg9217eeuP61fLI7WY';
  private base_url_games : string = 'https://api.rawg.io/api/games';
  private base_url_anime : string = 'https://api.jikan.moe/v4';
  private base_url_films_series : string = 'https://api.themoviedb.org/3';
  constructor(
    private http: HttpClient
  ) { }


  getHeadersFilmsSeries() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.API_KEY_FILMS_SERIES}`,
      'Content-Type': 'application/json;charset=utf-8',
    });
  }

  getTopAnimes ( page: number = 1) : Observable<Anime> {
    return this.http.get<Anime>(`${this.base_url_anime}/top/anime?page=${page}&filter=airing&limit=20&sfw=true`);
  }

  getAnimesBySearch ( search : string, page : string ) : Observable<Anime> {
    return this.http.get<Anime>(`${this.base_url_anime}/anime?q=${search}&sfw=true&page=${page}`);
  }

  getTopVideogames ( page : number = 1) : Observable<any> {
    return this.http.get<Videogame>(`${this.base_url_games}?key=${this.API_KEY_GAMES}&page=${page}&ordering=-rating`);
  }

  getVideogamesBySearch ( search : string, page : number ) : Observable<any> {
    return this.http.get<Videogame>(`${this.base_url_games}?key=${this.API_KEY_GAMES}&page=${(page)}&ordering=-rating&search=${search}`);
  }

  getTopSeries ( page: number = 1) : Observable<SerieResult>{
    return this.http.get<SerieResult>(`${this.base_url_films_series}/tv/top_rated?language=en-US&page=${page}`, {headers: this.getHeadersFilmsSeries()});
  }

  getSeriesBySearch ( search : string, page : number ) : Observable<SerieResult> {
    return this.http.get<SerieResult>(`${this.base_url_films_series}/search/tv?query=${search}&language=en-US&page=${page}`, {headers: this.getHeadersFilmsSeries()});
  }

  getGenresSeries () : Observable<GenreSeries> {
    return this.http.get<GenreSeries>(`${this.base_url_films_series}/genre/tv/list?language=en-US`, {headers: this.getHeadersFilmsSeries()});
  }

  getGenresMovies () : Observable<GenreMovies> {
    return this.http.get<GenreMovies>(`${this.base_url_films_series}/genre/tv/list?language=en-US`, {headers: this.getHeadersFilmsSeries()});
  }

  getTopMovies ( page: number = 1) : Observable<MovieResult>{
    return this.http.get<MovieResult>(`${this.base_url_films_series}/movie/top_rated?language=en-US&page=${page}`, {headers: this.getHeadersFilmsSeries()});
  }

  getMoviesBySearch ( search : string, page : number ) : Observable<MovieResult> {
    return this.http.get<MovieResult>(`${this.base_url_films_series}/search/movie?query=${search}&language=en-US&page=${page}`, {headers: this.getHeadersFilmsSeries()});
  }


  

  
}
