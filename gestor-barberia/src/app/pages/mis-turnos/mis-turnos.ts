import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-turnos.html',
  styleUrls: ['./mis-turnos.scss']
})
export class MisTurnosComponent implements OnInit {
  myAppointments$: Observable<any[]>;
  private firestore = inject(Firestore);
  userId = '';

  constructor() {
    this.userId = localStorage.getItem('userUid') || '';
    const appointmentsCollection = collection(this.firestore, 'appointments');
    const q = query(appointmentsCollection, where('userId', '==', this.userId));
    this.myAppointments$ = collectionData(q, { idField: 'id' });
  }

  ngOnInit() {
    const role = localStorage.getItem('userRole');
    if (role !== 'cliente') {
      window.location.href = '/';
    }
  }
}
