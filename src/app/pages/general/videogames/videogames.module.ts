import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideogamesPageRoutingModule } from './videogames-routing.module';

import { VideogamesPage } from './videogames.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    VideogamesPageRoutingModule
  ],
  declarations: [VideogamesPage]
})
export class VideogamesPageModule {}
