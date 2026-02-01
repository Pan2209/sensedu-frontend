import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../../services/api.services';
import { IonHeader, IonToolbar, IonButton, IonTitle, IonContent, IonItem, IonInput,IonList,IonLabel, IonNote } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [IonInput, IonItem, IonContent, IonTitle, IonButton, IonToolbar, IonHeader,CommonModule,FormsModule, IonList,IonLabel, IonNote],
})
export class UsuariosPage implements OnInit {

  users: any[] = [];
  newUserName: string = '';
  selectedUserId: number | null = null;

  constructor(
    private api: ApiService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.api.getUsers().subscribe((data: any) => {
      this.users = data;
    });
  }

  createUser() {
    if (!this.newUserName.trim()) return;

    this.api.createUser(this.newUserName).subscribe({
  next: () => {
    this.loadUsers();
    this.newUserName = '';
  },
  error: (err: any) => {
    console.error('Error creando usuario', err);
  }
});

  }

  selectUser(user: any) {
    this.selectedUserId = user.id;
    localStorage.setItem('userId', user.id.toString());
  }

  async confirmDeleteUser(user: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: 'Este usuario tiene lecciones registradas. Si lo eliminas se borrarán todas sus lecciones. ¿Estás seguro de que deseas eliminarlo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          role: 'confirm',
          handler: () => {
            this.deleteUser(user.id);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteUser(id: number) {
    this.api.deleteUser(id).subscribe({
      next: () => {
        if (this.selectedUserId === id) {
          this.selectedUserId = null;
          localStorage.removeItem('userId');
        }
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error eliminando usuario', err);
      }
    });
  }
}
