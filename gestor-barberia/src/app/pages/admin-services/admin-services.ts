import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-services.html',
  styleUrls: ['./admin-services.scss']
})
export class AdminServicesComponent implements OnInit {
  services$: Observable<any[]>;
  private firestore = inject(Firestore);

  // Para crear/editar
  form = { name: '', duration: 30, price: 10, active: true, id: null };
  editMode = false;

  constructor() {
    const servicesCollection = collection(this.firestore, 'services');
    this.services$ = collectionData(servicesCollection, { idField: 'id' });
  }

  ngOnInit() {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      window.location.href = '/';
    }
  }

  async saveService() {
    const servicesCollection = collection(this.firestore, 'services');
    if (this.editMode && this.form.id) {
      const docRef = doc(this.firestore, 'services', this.form.id);
      await updateDoc(docRef, {
        name: this.form.name,
        duration: this.form.duration,
        price: this.form.price,
        active: this.form.active
      });
    } else {
      await addDoc(servicesCollection, {
        name: this.form.name,
        duration: this.form.duration,
        price: this.form.price,
        active: true
      });
    }
    this.resetForm();
  }

  editService(service: any) {
    this.editMode = true;
    this.form = { ...service };
  }

  resetForm() {
    this.form = { name: '', duration: 30, price: 10, active: true, id: null };
    this.editMode = false;
  }

  async deleteService(id: string) {
    if (confirm('¿Seguro que deseas eliminar este servicio?')) {
      const docRef = doc(this.firestore, 'services', id);
      await deleteDoc(docRef);
    }
  }

  async toggleActive(service: any) {
    const docRef = doc(this.firestore, 'services', service.id);
    await updateDoc(docRef, { active: !service.active });
  }
}
