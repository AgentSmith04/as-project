import { Component, inject } from '@angular/core';
import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NgForOf, AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgForOf, AsyncPipe, JsonPipe],
  template: `
    <h1>Usuarios desde Firestore:</h1>
    <ul>
      <li *ngFor="let user of users$ | async">
        {{ user | json }}
      </li>
    </ul>
    <button (click)="agregarUsuario()">Agregar usuario</button>
  `
})
export class AppComponent {
  users$: Observable<any[]>;
  private firestore = inject(Firestore);

  constructor() {
    const usersCollection = collection(this.firestore, 'users');
    this.users$ = collectionData(usersCollection, { idField: 'id' });
  }

  async agregarUsuario() {
    const usersCollection = collection(this.firestore, 'users');
    await addDoc(usersCollection, {
      nombre: 'Usuario de prueba',
      email: 'prueba@email.com'
    });
  }
}
