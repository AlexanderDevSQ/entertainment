import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideogamesPersonalPageRoutingModule } from './videogames-personal-routing.module';

import { VideogamesPersonalPage } from './videogames-personal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideogamesPersonalPageRoutingModule
  ],
  declarations: [VideogamesPersonalPage]
})
export class VideogamesPersonalPageModule {}
