import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { map } from 'rxjs';
import { Videogame } from 'src/app/interfaces/Videogame';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-videogames',
  templateUrl: './videogames.page.html',
  styleUrls: ['./videogames.page.scss'],
  standalone: false
})
export class VideogamesPage implements OnInit {

  videogames : Videogame[] = [];
  originalVideogames : Videogame[] = [];
  page: number = 1;
  loadedPages: Set<number> = new Set();
  isLoaded: boolean = false;
  searchExpr : string = '';
  isInfiniteScrollDisabled = false;

  nextPage() {
    this.page++;
    this.loadVideogames();
  }
  
  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  get pageVideogames() {
    const pageSize = 25;
    const start = (this.page - 1) * pageSize;
    return this.videogames.slice(start, start + pageSize);
  }

  constructor(
    private requestService : RequestsService,
    private navController: NavController
  ) { }

  async ngOnInit() {
    await this.loadVideogames();
  }

  filterVideogames(searchTerm: string) {
    const searchExpr = searchTerm.toLowerCase().trim();
  
    if (!searchExpr) {
      this.videogames = this.originalVideogames;
      this.searchExpr = '';
      return;
    }
  
    this.searchExpr = searchExpr;
    this.loadedPages.clear();
  
    this.requestService.getVideogamesBySearch(this.searchExpr, this.page)
      .subscribe((response: { data: Videogame[] }) => {
      this.videogames = [...response.data]; 
      this.page++;
      });
  }

  async loadVideogames() {
     if (this.searchExpr === '') {
          if (this.loadedPages.has(this.page)) return;
      
          this.isLoaded = false;
      
          this.requestService.getTopVideogames(this.page)
            .pipe(
              map((response) => {
                const videogames = response.results;
                console.log("Response: ", response);
                return videogames.filter((videogame: Videogame, index: number, self: Videogame[]) =>
                  index === self.findIndex((a: Videogame) => a.id === videogame.id)
                );
              })
            )
            .subscribe((filteredVideogames) => {
              this.videogames = [...this.videogames, ...filteredVideogames];
              this.originalVideogames = [...this.videogames];
              this.loadedPages.add(this.page);
              this.isLoaded = true;
            });
      
        } else {
          this.filterVideogames(this.searchExpr); 
        }
    this.isLoaded = true;
  }

  doRefresh(event: any) {
    console.log('Begin async operation', event);
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  detailVideogame(videogame: Videogame) {
    this.navController.navigateForward('detail/games-detail', {
      animated: true,
      animationDirection: 'forward',
      state: { videogame }
    });
  }

  searchVideogames(event : any) {
    const value = event.target.value || '';
    this.filterVideogames(value);
  }

  onIonInfinite(event: any) {
    this.page++;
    console.log("Page: ", this.page);
  }

}
