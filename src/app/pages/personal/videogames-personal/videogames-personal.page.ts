import { VideogamesService } from './../../../services/videogames.service';
import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { RateEntertainmentComponent } from 'src/app/components/rate-entertainment/rate-entertainment.component';
import { Videogame } from 'src/app/interfaces/Videogame';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-videogames-personal',
  templateUrl: './videogames-personal.page.html',
  styleUrls: ['./videogames-personal.page.scss'],
  standalone: false
})
export class VideogamesPersonalPage implements OnInit {



  videogamesOnRequest: Videogame[] = [];
  page: number = 1;
  searchExpr : string = '';
  videogames: Videogame[] = [];
  isInfiniteScrollDisabled = false;

  constructor(
    private requestService: RequestsService,
    private navController: NavController, 
    private modalController: ModalController,
    private videogameService: VideogamesService

  ) { }

  ngOnInit() {
    this.loadStoredVideogames();
  }


  searchVideogames ( event? : any ) {
    const searchExpr = event.target.value?.toLowerCase() || '';
    this.searchExpr = searchExpr;
    if (!searchExpr.trim() && searchExpr.length == 0) {
      this.videogamesOnRequest = [];
      this.page = 1;
      return;
    }

    this.requestService.getVideogamesBySearch(this.searchExpr, this.page)
      .subscribe((response) => {
        this.videogamesOnRequest = [...this.videogamesOnRequest, ...response.results];
      });
  }

  getStateColor(state: string | undefined): string {
    switch (state) {
      case 'Not Started':
        return 'danger';
      case 'Watching':
        return 'warning';
      case 'Completed':
        return 'success';
      case 'On Hold':
        return 'medium';
      case 'Dropped':
        return 'dark';
      default:
        return 'primary';
    }
  }

  onInfiniteScroll(event: any) {
    this.page++;
    this.requestService.getVideogamesBySearch(this.searchExpr, this.page)
      .subscribe((response) => {
        this.videogamesOnRequest = [...this.videogamesOnRequest, ...response.results];
      });
    setTimeout(() => {
      event.target.complete();
    }, 500);

  }


  detailVideogame(videogame: Videogame) {
    this.navController.navigateForward('/detail/games-detail', {
      animated: true,
      animationDirection: 'forward', // or 'back'
      state: { videogame }
    });
  }

  loadStoredVideogames () {
    this.videogameService.getVideogames().then((videogames) => {
      this.videogames = videogames.filter((videogame, index, self) =>
        index === self.findIndex(v => v.id === videogame.id));
    });
  }

  doRefresh( event : any ) {
    setTimeout(() => {
      this.loadStoredVideogames();
      event.target.complete();
    }, 500);
  }


  async rateVideogame ( videogame: Videogame) {
      const modal = await this.modalController.create({
        component: RateEntertainmentComponent
      });
  
      await modal.present();
  
      const { data } = await modal.onWillDismiss();
      if (data ) {
        const rating = data.data;
        if (videogame.personal) {
          videogame.personal.personal_rating = rating.toString();
        }
        this.videogameService.updateVideogame(videogame.id.toString(), videogame);
      }
    }
}
