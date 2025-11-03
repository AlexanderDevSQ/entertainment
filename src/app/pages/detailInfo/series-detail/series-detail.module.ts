import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeriesDetailPageRoutingModule } from './series-detail-routing.module';

import { SeriesDetailPage } from './series-detail.page';
import { FiltroPipe } from 'src/app/pipes/filtro.pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeriesDetailPageRoutingModule,
    FiltroPipe,
    TranslateModule
  ],
  declarations: [SeriesDetailPage]
})
export class SeriesDetailPageModule {}
