import { Component, OnInit } from '@angular/core';
import { ComponentsModule } from '../components.module';
import { IonicModule, MenuController, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import Menu from 'src/app/interfaces/Menu';
import { DataService } from 'src/app/services/data.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'menu-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [IonicModule, CommonModule, TranslateModule],
})
export class SidebarComponent  implements OnInit {


  menus : Menu[] = [];
  openIndex: number | null = null;

  constructor(
    private dataService : DataService,
    private navController: NavController,
    private menuController: MenuController,
  ) { }

  async ngOnInit(): Promise<void> {
    this.dataService.getSidebarMenus().subscribe((data : any) => {
      this.menus = data;
    })
  }

  toggleSubMenu ( menu : Menu ) {
    menu.isOpen = !menu.isOpen;

  }

  collapseAll() {
    const collapseRecursive = (items: any[]) => {
      items.forEach(item => {
        if (item.isOpen) {
          item.isOpen = false;
        }
        if (item.subMenu) {
          collapseRecursive(item.subMenu);
        }
      });
    };

    collapseRecursive(this.menus);
  }

  goToLink(menu: Menu) {
    console.log(menu)
    if (menu.subMenu) {
      this.toggleSubMenu(menu);
    } else {
      this.menuController.close();
      if ( menu.url?.startsWith('/settings'))
      {
        console.log('enter')
        this.navController.navigateForward(menu.url, {
          animated: true,
          animationDirection: 'forward'
        })
      } else {
        this.navController.navigateForward('/personal' + menu.url, {
          animated: true,
          animationDirection: 'forward', // or 'back'
        });
      }
    }
  }
}
