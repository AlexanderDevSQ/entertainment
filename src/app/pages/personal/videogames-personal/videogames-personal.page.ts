import { VideogamesService } from './../../../services/videogames.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ModalController, IonContent, LoadingController } from '@ionic/angular';
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




  @ViewChild(IonContent) content?: IonContent;

  videogamesOnRequest: Videogame[] = [];
  page: number = 1;
  searchExpr : string = '';
  videogames: Videogame[] = [];
  isInfiniteScrollDisabled = false;
  noResponse: boolean = false;
  noResults: boolean = false;
  subscription: any;

  constructor(
    private requestService: RequestsService,
    private navController: NavController,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private videogameService: VideogamesService

  ) { }

  ngOnInit() {
    this.loadStoredVideogames();
  }

  ionViewWillEnter(){
    this.loadStoredVideogames();
    this.subscription = this.videogameService.videogames$.subscribe(videogames => {
      this.videogames = videogames.filter(m => m.personal)
    });
  }

  ionViewWillLeave(){
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async searchVideogames ( event? : any ) {
    const loading = await this.loadingController.create({
      //Maybe Add Message, lets see how it goes
    });

    loading.present();

    const searchExpr = event.target.value?.toLowerCase() || '';
    this.searchExpr = searchExpr;
    if (!searchExpr.trim() && searchExpr.length === 0) {
      this.videogamesOnRequest = [];
      this.page = 1;
      loading.dismiss();
      return;
    }

    this.requestService.getVideogamesBySearch(this.searchExpr, this.page)
      .subscribe((response) => {
        if (response.length == 0 ) {
          this.noResponse = true;
          loading.dismiss();
        } else{
          this.videogamesOnRequest = [...response];
          loading.dismiss();
        }
      });
  }

  resetPage() {
    this.noResults = false;
    this.videogamesOnRequest = [];
    this.page = 1;
    this.searchExpr = '';
  }

  getStateColor(state: string | undefined): string {
    switch (state) {
      case 'personal.status.notStarted':
        return 'danger';
      case 'personal.status.watching':
        return 'warning';
      case 'personal.status.completed':
        return 'success';
      case 'personal.status.onHold':
        return 'tertiary';
      case 'personal.status.dropped':
        return 'medium';
      default:
        return 'medium';
    }
  }

  async loadMore() {

    const loading = await this.loadingController.create({
    });

    loading.present();

    this.page++;
    this.requestService.getVideogamesBySearch(this.searchExpr, this.page)
      .subscribe((response) => {
        if (response.length == 0 ) {
          this.noResponse = true;
          loading.dismiss();
          return;
        } else{
          this.videogamesOnRequest = [...this.videogamesOnRequest, ...response];
          loading.dismiss();
        }
      });

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
  onInfiniteScroll() {
    this.page++;
    this.requestService.getVideogamesBySearch(this.searchExpr, this.page)
      .subscribe((response) => {
        if (response.length == 0 ) {
          this.noResults = true;
          return;
        }
        console.log(response)
        this.videogamesOnRequest = [...this.videogamesOnRequest, ...response];
      });
  }
}

