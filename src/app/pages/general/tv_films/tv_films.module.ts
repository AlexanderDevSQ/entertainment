import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TvFilmsPage } from './tv_films';

import { TvFilmsRoutingModule } from './tv_films-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TvFilmsRoutingModule,
    TranslateModule
  ],

  declarations: [TvFilmsPage]
})
export class TvFilmsModule {}
