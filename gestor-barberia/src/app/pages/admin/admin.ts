import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminComponent {
  users$: Observable<any[]>;
  private firestore = inject(Firestore);

  // Variables para formulario de edición
  editMode = false;
  currentUser: any = {};

  constructor() {
    const usersCollection = collection(this.firestore, 'users');
    this.users$ = collectionData(usersCollection, { idField: 'id' });
  }

  async addUser() {
    const usersCollection = collection(this.firestore, 'users');
    await addDoc(usersCollection, {
      name: 'Usuario Nuevo',
      email: 'nuevo@email.com',
      role: 'Cliente'
    });
  }

  editUser(user: any) {
    this.editMode = true;
    this.currentUser = { ...user };
  }

  async saveUser() {
    const userDoc = doc(this.firestore, 'users', this.currentUser.id);
    await updateDoc(userDoc, {
      name: this.currentUser.name,
      email: this.currentUser.email,
      role: this.currentUser.role
    });
    this.editMode = false;
    this.currentUser = {};
  }

  cancelEdit() {
    this.editMode = false;
    this.currentUser = {};
  }

  async deleteUser(id: string) {
    const userDoc = doc(this.firestore, 'users', id);
    await deleteDoc(userDoc);
  }
}
