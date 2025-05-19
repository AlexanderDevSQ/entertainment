import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private ToastController: ToastController,
  ) { }


  async displayNotification ( 
    message: string, 
    duration? : number, 
    position? : 'top' | 'bottom' | 'middle',
    icon?: 'checkmark-circle-outline' | 'alert-circle-outline' | 'information-circle-outline',
    color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'dark') {
      const toast = await this.ToastController.create({
        message: message,
        position: position || 'bottom',
        color: color,
        keyboardClose: true,
        icon: icon,
        buttons: [
          {
            side: 'end',
            icon: 'close-outline',
            role: 'cancel', // Optional: lets it behave like cancel
            handler: () => {
              console.log('Toast closed');
            }
          },
        ],  
        duration: duration || 2000,
      });
      toast.present();
  }
}
