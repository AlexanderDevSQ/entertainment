import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TvSeriesPage } from './tv_series.page';

const routes: Routes = [
  {
    path: '',
    component: TvSeriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TvSeriesPageRoutingModule {}
