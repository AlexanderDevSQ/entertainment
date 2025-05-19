import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { RateEntertainmentComponent } from 'src/app/components/rate-entertainment/rate-entertainment.component';
import { Videogame } from 'src/app/interfaces/Videogame';
import { NotificationsService } from 'src/app/services/notifications.service';
import { RequestsService } from 'src/app/services/requests.service';
import { VideogamesService } from 'src/app/services/videogames.service';

@Component({
  selector: 'app-games-detail',
  templateUrl: './games-detail.page.html',
  styleUrls: ['./games-detail.page.scss'],
  standalone: false
})
export class GamesDetailPage implements OnInit {


  videogame!: Videogame;
  showFullText: boolean = false;
  availableStates: string[] = ['Not Started', 'Watching', 'Completed', 'On Hold', 'Dropped'];
  genreFromGames: string[] = []


  
  toggleText(){
    this.showFullText = !this.showFullText;
  }

  constructor(
    private router: Router,
    private videogamesService: VideogamesService,
    private requestService: RequestsService,
    private notificationService: NotificationsService,
    private modalController: ModalController
  ) { }

  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.videogame = navigation?.extras.state?.['videogame'];
    await this.getGenres();
  }

  async getGenres() {
    this.videogame.genres.forEach(genre => {
        this.genreFromGames.push(genre.name)
    });
  }

  watchTrailer( url : string | null ) {
    window.open(url!, '_blank');
  }

  handleVideogameSave ( videogame: Videogame, isSaved: boolean | undefined ) {
    if ( isSaved ) {
      this.videogamesService.removeVideogame(videogame.id.toString());
      this.videogame.personal = undefined;
      this.videogame.isSaved = false;
      this.notificationService.displayNotification('Videogame removed succesfully from your list', 2000, 'top', 'alert-circle-outline', 'danger');
      return;
    }
    this.videogame.isSaved = true;
    this.videogame.personal = { personal_rating : null, state: 'Not Started'};
    this.videogamesService.addVideogame(videogame);
    this.notificationService.displayNotification('Videogame added succesfully to your list', 2000, 'top', 'checkmark-circle-outline', 'success');
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
        return 'tertiary';
      case 'Dropped':
        return 'danger';
      default:
        return 'medium';
    }
  }

  changeState() {
    if (this.videogame.personal) {
      const currentIndex = this.availableStates.indexOf(this.videogame.personal.state || 'Not Started');
      const nextIndex = (currentIndex + 1) % this.availableStates.length;
      const nextState = this.availableStates[nextIndex];
      this.videogame.personal.state = nextState;
      this.videogamesService.updateVideogame(this.videogame.id.toString(), this.videogame);

      return { id: this.videogame.id, state: nextState };
    }

    return {id : this.videogame.id, state: undefined};
  }

  async editRating ( videogame: Videogame) {
    const modal = await this.modalController.create({
                    component: RateEntertainmentComponent,
                  });
                
                  await modal.present();
                
                  const { data } = await modal.onWillDismiss();
                  if (data) {
                    const rating = data.data;
                    if (videogame.personal) {
                      videogame.personal.personal_rating = rating.toString();
                    }
                    this.videogamesService.updateVideogame(videogame.id.toString(), videogame);
    }
  }




}
