import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'anime-detail',
    loadChildren: () => import('../anime-detail/anime-detail.module').then(m => m.AnimeDetailPageModule)
  },
  {
    path: 'serie-detail',
    loadChildren: () => import('../series-detail/series-detail.module').then(m => m.SeriesDetailPageModule)
  },
  {
    path: 'movie-detail',
    loadChildren: () => import('../movie-detail/movie-detail.module').then(m => m.MovieDetailPageModule)
  },
  {
    path: 'games-detail',
    loadChildren: () => import('../games-detail/games-detail.module').then(m => m.GamesDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class DetailsRoutingModule {}
