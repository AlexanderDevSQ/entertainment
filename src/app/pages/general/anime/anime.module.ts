import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnimePageRoutingModule } from './anime-routing.module';

import { AnimePage } from './anime.page';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnimePageRoutingModule,
    ComponentsModule,
    TranslateModule
  ],
  declarations: [AnimePage]
})
export class AnimePageModule {}
