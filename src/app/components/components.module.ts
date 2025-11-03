import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FirstTimeComponent } from './first-time/first-time.component';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { RateEntertainmentComponent } from './rate-entertainment/rate-entertainment.component';
import { LanguageComponent } from './settings/language/language.component';


  @NgModule({
  declarations: [
    FirstTimeComponent,
    RateEntertainmentComponent,
    LanguageComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    SidebarComponent,
  ],
  exports: [
    FirstTimeComponent,
    SidebarComponent,
  ]
})
export class ComponentsModule { }
