import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnimeDetailPageRoutingModule } from './anime-detail-routing.module';

import { AnimeDetailPage } from './anime-detail.page';
import { FiltroPipe } from "../../../pipes/filtro.pipe";
import { TranslateModule } from '@ngx-translate/core';
import { AutoTranslatePipe } from 'src/app/pipes/auto-translate.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnimeDetailPageRoutingModule,
    FiltroPipe,
    TranslateModule,
    AutoTranslatePipe,
],
  declarations: [AnimeDetailPage]
})
export class AnimeDetailPageModule {}
