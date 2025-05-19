import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideogamesPersonalPage } from './videogames-personal.page';

const routes: Routes = [
  {
    path: '',
    component: VideogamesPersonalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideogamesPersonalPageRoutingModule {}
