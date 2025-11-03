import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoviePersonalPageRoutingModule } from './movie-personal-routing.module';

import { MoviePersonalPage } from './movie-personal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    MoviePersonalPageRoutingModule
  ],
  declarations: [MoviePersonalPage]
})
export class MoviePersonalPageModule {}
