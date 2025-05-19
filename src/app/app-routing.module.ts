import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'detail',
    loadChildren: () => import('./pages/detailInfo/detail/detail.module').then(m => m.DetailModule)
  },
  {
    path: 'personal',
    loadChildren: () => import('./pages/personal/personal/personal.module').then(m => m.PersonalModule)
  },
  {
    path: 'movie-detail',
    loadChildren: () => import('./pages/detailInfo/movie-detail/movie-detail.module').then( m => m.MovieDetailPageModule)
  },
  {
    path: 'movie-personal',
    loadChildren: () => import('./pages/personal/movie-personal/movie-personal.module').then( m => m.MoviePersonalPageModule)
  },
  {
    path: 'games-detail',
    loadChildren: () => import('./pages/detailInfo/games-detail/games-detail.module').then( m => m.GamesDetailPageModule)
  },
  {
    path: 'videogames-personal',
    loadChildren: () => import('./pages/personal/videogames-personal/videogames-personal.module').then( m => m.VideogamesPersonalPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
