import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeriePersonalPage } from './serie-personal.page';

const routes: Routes = [
  {
    path: '',
    component: SeriePersonalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeriePersonalPageRoutingModule {}
