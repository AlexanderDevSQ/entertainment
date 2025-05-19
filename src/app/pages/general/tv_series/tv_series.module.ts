import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TvSeriesPageRoutingModule } from './tv_series-routing.module';
import { TvSeriesPage } from './tv_series.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TvSeriesPageRoutingModule,
  ],
  declarations: [TvSeriesPage],
})
export class TvSeriesPageModule {}
