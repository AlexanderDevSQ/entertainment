import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetailsRoutingModule } from './detail-routing.module';



@NgModule({
  declarations: [],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DetailsRoutingModule,
    ComponentsModule
  ]
})
export class DetailModule { }
