import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideogamesPersonalPageRoutingModule } from './videogames-personal-routing.module';

import { VideogamesPersonalPage } from './videogames-personal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideogamesPersonalPageRoutingModule,
    TranslateModule
  ],
  declarations: [VideogamesPersonalPage]
})
export class VideogamesPersonalPageModule {}
