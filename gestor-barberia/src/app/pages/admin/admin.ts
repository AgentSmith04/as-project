import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminComponent {
  users$: Observable<any[]>;
  private firestore = inject(Firestore);

  constructor() {
    const usersCollection = collection(this.firestore, 'users');
    this.users$ = collectionData(usersCollection, { idField: 'id' });
  }

  editUser(id: string) {
    alert('Editar usuario con id ' + id);
  }

  deleteUser(id: string) {
    alert('Eliminar usuario con id ' + id);
  }

  blockUser(id: string) {
    alert('Bloquear usuario con id ' + id);
  }
}
