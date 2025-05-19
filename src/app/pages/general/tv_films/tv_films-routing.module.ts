import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TvFilmsPage } from './tv_films';

const routes: Routes = [
  {
    path: '',
    component: TvFilmsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TvFilmsRoutingModule {}
