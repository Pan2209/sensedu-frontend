import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../../services/api.services';
import { Chart, ArcElement, Tooltip, Legend, registerables } from 'chart.js';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
Chart.register(...registerables);
@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  imports: [ CommonModule, IonCardHeader, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,IonCard, IonCardHeader, IonCardTitle, IonCardContent],
})
export class RegistroPage implements OnInit, AfterViewInit {

  stats: any[] = [];
  userId!: number;

  constructor(private api: ApiService) {}

  ngOnInit() {
    const id = localStorage.getItem('userId');
    if (!id) return;

    this.userId = Number(id);
    this.loadStats();
  }

  ngAfterViewInit() {
    // Esperamos a que los datos estén listos
    setTimeout(() => {
      this.renderCharts();
    }, 500);
  }

  loadStats() {
    this.api.getStatsByUser(this.userId).subscribe(data => {
      this.stats = Object.entries(data).map(([letter, values]: [string, any]) => ({
        letter,
        correct: values.correct,
        incorrect: values.incorrect
      }));
    });
  }


  
  renderCharts() {

    const topCorrect = [...this.stats].sort((a, b) => b.correct - a.correct).slice(0, 5);
    const topIncorrect = [...this.stats].sort((a, b) => b.incorrect - a.incorrect).slice(0, 5);

    new Chart('correctChart', {
      type: 'pie',
      data: {
        labels: topCorrect.map(s => s.letter),
        datasets: [{
          data: topCorrect.map(s => s.correct),
          backgroundColor: ['#4CAF50', '#81C784', '#A5D6A7', '#C8E6C9', '#E8F5E9']
        }]
      }
    });

    new Chart('incorrectChart', {
      type: 'pie',
      data: {
        labels: topIncorrect.map(s => s.letter),
        datasets: [{
          data: topIncorrect.map(s => s.incorrect),
          backgroundColor: ['#F44336', '#E57373', '#EF9A9A', '#FFCDD2', '#FFEBEE']
        }]
      }
    });
  }
}
