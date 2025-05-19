import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeriePersonalPageRoutingModule } from './serie-personal-routing.module';

import { SeriePersonalPage } from './serie-personal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeriePersonalPageRoutingModule
  ],
  declarations: [SeriePersonalPage]
})
export class SeriePersonalPageModule {}
