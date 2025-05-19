import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoviePersonalPage } from './movie-personal.page';

const routes: Routes = [
  {
    path: '',
    component: MoviePersonalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoviePersonalPageRoutingModule {}
