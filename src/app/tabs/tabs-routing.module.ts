import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tv-films',
        loadChildren: () => import('../pages/general/tv_films/tv_films.module').then(m => m.TvFilmsModule)
      },
      {
        path: 'tv-series',
        loadChildren: () => import('../pages/general/tv_series/tv_series.module').then(m => m.TvSeriesPageModule)
      },
      {
        path: 'videogames',
        loadChildren: () => import('../pages/general/videogames/videogames.module').then(m => m.VideogamesPageModule)
      },
      {
        path: 'books',
        loadChildren: () => import('../pages/general/books/books.module').then(m => m.BooksPageModule)
      },
      {
        path: 'anime',
        loadChildren: () => import('../pages/general/anime/anime.module').then(m => m.AnimePageModule)
      },
      {
        path: '',
        redirectTo: 'tv-films',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tv-films',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
