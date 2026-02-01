import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.services';

@Component({
  selector: 'app-aprender',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './aprender.page.html',
  styleUrls: ['./aprender.page.scss']
})
export class AprenderPage {

  letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  constructor(private api: ApiService) {}

sendLetter(letter: string) {
  this.api.sendLetter(letter).subscribe({
    next: (res) => {
      if (res.success) {
        console.log('Letra enviada:'+ (letter), res.data);
      } else {
        console.warn('ESP32 devolvió error:', res.error);
      }
    },
    error: (err) => console.error('Error en backend:', err)
  });
}


}


