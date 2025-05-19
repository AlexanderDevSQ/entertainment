import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GamesDetailPage } from './games-detail.page';

const routes: Routes = [
  {
    path: '',
    component: GamesDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamesDetailPageRoutingModule {}
