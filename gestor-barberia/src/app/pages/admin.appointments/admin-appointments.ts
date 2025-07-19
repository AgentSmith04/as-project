import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface Usuario {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'barbero' | 'cliente';
  // agrega otros campos si los necesitas
}

@Component({
  selector: 'app-admin-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-appointments.html',
  styleUrls: ['./admin-appointments.scss']
})
export class AdminAppointmentsComponent implements OnInit {
  appointments$: Observable<any[]>;
  allAppointments: any[] = [];
  filteredAppointments: any[] = [];
  private firestore = inject(Firestore);

  // Filtros
  filterBarber: string = '';
  filterClient: string = '';
  filterDate: string = '';

  barbers: Usuario[] = [];
  clients: Usuario[] = [];

  constructor() {
    // Trae todos los turnos
    const appointmentsCollection = collection(this.firestore, 'appointments');
    this.appointments$ = collectionData(appointmentsCollection, { idField: 'id' });

    // Trae todos los usuarios
    const usersCollection = collection(this.firestore, 'users');
    collectionData(usersCollection, { idField: 'id' }).subscribe(users => {
      const usuarios = users as Usuario[];
      this.barbers = usuarios.filter(u => u.role === 'barbero');
      this.clients = usuarios.filter(u => u.role === 'cliente');
    });
  }

  ngOnInit() {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      window.location.href = '/';
    }
    this.appointments$.subscribe(appointments => {
      this.allAppointments = appointments;
      this.filteredAppointments = appointments;
    });
  }

  filtrar() {
    this.filteredAppointments = this.allAppointments.filter(app => {
      const matchBarber = this.filterBarber ? (app.barberId === this.filterBarber) : true;
      const matchClient = this.filterClient ? (app.userId === this.filterClient) : true;
      const matchDate = this.filterDate ? (app.date === this.filterDate) : true;
      return matchBarber && matchClient && matchDate;
    });
  }

  limpiarFiltros() {
    this.filterBarber = '';
    this.filterClient = '';
    this.filterDate = '';
    this.filteredAppointments = this.allAppointments;
  }
}
