import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GamesDetailPageRoutingModule } from './games-detail-routing.module';

import { GamesDetailPage } from './games-detail.page';
import { FiltroPipe } from 'src/app/pipes/filtro.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { AutoTranslatePipe } from 'src/app/pipes/auto-translate.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GamesDetailPageRoutingModule,
    FiltroPipe,
    TranslateModule,
    AutoTranslatePipe,
  ],
  declarations: [GamesDetailPage]
})
export class GamesDetailPageModule {}
