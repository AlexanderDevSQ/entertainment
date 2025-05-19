import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoviePersonalPageRoutingModule } from './movie-personal-routing.module';

import { MoviePersonalPage } from './movie-personal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoviePersonalPageRoutingModule
  ],
  declarations: [MoviePersonalPage]
})
export class MoviePersonalPageModule {}
