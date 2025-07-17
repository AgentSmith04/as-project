import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, updateDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminComponent implements OnInit {
  users$: Observable<any[]>;
  private firestore = inject(Firestore);

  // Para editar usuarios
  editMode = false;
  currentUser: any = {};

  constructor() {
    const usersCollection = collection(this.firestore, 'users');
    this.users$ = collectionData(usersCollection, { idField: 'id' });
  }

  // Protege el componente: solo admin accede
  ngOnInit() {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      window.location.href = '/'; // Redirige si no es admin
    }
  }

  // CRUD Básico:
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

  // Handler del select para cambio de rol
  onRoleChange(userId: string, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement && selectElement.value) {
      this.cambiarRol(userId, selectElement.value);
    }
  }

  // Cambiar rol en la base
  async cambiarRol(userId: string, nuevoRol: string) {
    const userDoc = doc(this.firestore, 'users', userId);
    await updateDoc(userDoc, { role: nuevoRol });
  }
}
