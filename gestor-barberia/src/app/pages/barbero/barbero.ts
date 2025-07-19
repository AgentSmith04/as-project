import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, query, where, updateDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-barbero-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './barbero.html',
  styleUrls: ['./barbero.scss']
})
export class BarberoComponent implements OnInit {
  pendingAppointments$: Observable<any[]>;
  myAppointments$: Observable<any[]>;
  private firestore = inject(Firestore);

  barberoId = '';
  barberName = '';

  constructor() {
    const uid = localStorage.getItem('userUid');
    this.barberoId = uid ? uid : '';
    this.barberName = localStorage.getItem('userName') || '';

    const appointmentsCollection = collection(this.firestore, 'appointments');

    // Citas pendientes sin barbero asignado
    const qPending = query(appointmentsCollection, where('status', '==', 'pending'));
    this.pendingAppointments$ = collectionData(qPending, { idField: 'id' });

    // Citas ya asignadas a este barbero
    const qMine = query(appointmentsCollection, where('barberId', '==', this.barberoId));
    this.myAppointments$ = collectionData(qMine, { idField: 'id' });
  }

  ngOnInit() {
    const role = localStorage.getItem('userRole');
    if (role !== 'barbero') {
      window.location.href = '/';
    }
  }

  async acceptAppointment(appointment: any) {
    const appointmentDoc = doc(this.firestore, 'appointments', appointment.id);
    await updateDoc(appointmentDoc, {
      barberId: this.barberoId,
      barberName: this.barberName,
      status: 'confirmed'
    });
  }

  async changeStatus(appointment: any, status: string) {
    const appointmentDoc = doc(this.firestore, 'appointments', appointment.id);
    await updateDoc(appointmentDoc, { status: status });
  }
}
