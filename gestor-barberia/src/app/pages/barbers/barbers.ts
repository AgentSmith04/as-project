import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, addDoc, updateDoc, doc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-barbers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barbers.html',
  styleUrls: ['./barbers.scss']
})
export class BarbersComponent implements OnInit {
  barbers$: Observable<any[]>;
  private firestore = inject(Firestore);

  editMode = false;
  currentBarber: any = {};

  constructor() {
    const barbersCollection = collection(this.firestore, 'users');
    // Solo muestra barberos
    const q = query(barbersCollection, where('role', '==', 'barbero'));
    this.barbers$ = collectionData(q, { idField: 'id' });
  }

  ngOnInit() {
    const role = localStorage.getItem('userRole');
    // Solo permite acceso a admin
    if (role !== 'admin') {
      window.location.href = '/';
    }
  }

  editBarber(barber: any) {
    this.editMode = true;
    this.currentBarber = { ...barber };
  }

  async saveBarber() {
    const barberDoc = doc(this.firestore, 'users', this.currentBarber.id);
    await updateDoc(barberDoc, {
      name: this.currentBarber.name,
      email: this.currentBarber.email,
      role: 'barbero'
    });
    this.editMode = false;
    this.currentBarber = {};
  }

  cancelEdit() {
    this.editMode = false;
    this.currentBarber = {};
  }

  async deleteBarber(id: string) {
    const barberDoc = doc(this.firestore, 'users', id);
    await deleteDoc(barberDoc);
  }

  // Para crear un nuevo barbero (manual)
  async addBarber() {
    if (!this.currentBarber.name || !this.currentBarber.email) return;
    const barbersCollection = collection(this.firestore, 'users');
    await addDoc(barbersCollection, {
      name: this.currentBarber.name,
      email: this.currentBarber.email,
      role: 'barbero',
      createdAt: new Date()
    });
    this.currentBarber = {};
  }
}
