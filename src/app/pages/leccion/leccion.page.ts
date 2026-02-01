import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.services';

@Component({
  selector: 'app-leccion',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './leccion.page.html',
  styleUrls: ['./leccion.page.scss'],
})
export class LeccionPage implements OnInit, OnDestroy {

  letters: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  currentLetter: string = '';
  currentIndex: number = 0;

  sessionId!: number;
  userId!: number;

  startTime!: number;
  timeSpent: number = 0;

  constructor(private api: ApiService) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('Debes seleccionar un usuario primero');
      return;
    }

    this.userId = Number(userId);

    this.shuffleLetters();   // ✅ barajamos las letras
    this.createSession();
    this.nextLetter();
  }

  ngOnDestroy() {
    // Aquí luego puedes cerrar sesión si quieres
  }

  createSession() {
    this.api.createSession(this.userId).subscribe({
      next: (session) => {
        console.log('Sesión creada:', session);
        this.sessionId = session.id; 
        this.startTimer();
      },
      error: (err) => console.error('Error creando sesión', err)
    });
  }

  shuffleLetters() {
    this.letters = this.letters.sort(() => Math.random() - 0.5);
  }

  startTimer() {
    this.startTime = Date.now();
  }

  nextLetter() {
    if (this.currentIndex >= this.letters.length) {
      // ✅ ya no hay más letras
      this.currentLetter = '';
      alert('¡Lección terminada!');
      return;
    }

    this.currentLetter = this.letters[this.currentIndex];
    this.currentIndex++;
    this.startTimer();

  // ✅ enviar la letra al ESP32
  this.api.sendLetter(this.currentLetter).subscribe({
    next: (res) => console.log('Letra enviada al ESP32:', res),
    error: (err) => console.error('Error enviando letra al ESP32', err)
  });
}


  
  markAnswer(correct: boolean) {
    if(!this.sessionId) {
      console.error('Sesión no iniciada');
      return;
    }
    this.timeSpent = Math.floor((Date.now() - this.startTime) / 1000);

    this.api.createAttempt(
      this.sessionId,
      this.currentLetter,
      correct,
      this.timeSpent
    ).subscribe({
      next: () => this.nextLetter(),
      error: err => console.error('Error guardando intento', err)
    });
  }
}
