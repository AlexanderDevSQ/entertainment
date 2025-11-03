import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeriePersonalPageRoutingModule } from './serie-personal-routing.module';

import { SeriePersonalPage } from './serie-personal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeriePersonalPageRoutingModule,
    TranslateModule
  ],
  declarations: [SeriePersonalPage]
})
export class SeriePersonalPageModule {}
