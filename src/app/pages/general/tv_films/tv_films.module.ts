import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TvFilmsPage } from './tv_films';

import { TvFilmsRoutingModule } from './tv_films-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TvFilmsRoutingModule
  ],
  declarations: [TvFilmsPage]
})
export class TvFilmsModule {}
