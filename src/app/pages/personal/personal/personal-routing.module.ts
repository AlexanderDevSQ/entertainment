import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'anime-personal',
    loadChildren: () => import('../anime-personal/animes.module').then(m => m.AnimesPageModule)
  },
  {
    path: 'series-personal',
    loadChildren: () => import('../serie-personal/serie-personal.module').then(m => m.SeriePersonalPageModule)
  },
  {
    path: 'movies-personal',
    loadChildren: () => import('../movie-personal/movie-personal.module').then(m => m.MoviePersonalPageModule)
  },
  {
    path: 'videogames-personal',
    loadChildren: () => import('../videogames-personal/videogames-personal.module').then(m => m.VideogamesPersonalPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('../../about/about.module').then(m => m.AboutPageModule)
  },
  {
    path: 'ios',
    loadChildren: () => import('../../ios/ios.module').then(m => m.IosPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class PersonalRoutingModule {}
