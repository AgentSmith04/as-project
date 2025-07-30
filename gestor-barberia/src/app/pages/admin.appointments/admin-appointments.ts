import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface Usuario {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'barbero' | 'cliente';
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

  // --- EXPORTAR PDF ---
  exportarPDF() {
    const doc = new jsPDF();
    const columns = ['Servicio', 'Cliente', 'Barbero', 'Fecha', 'Hora', 'Estado'];
    const rows = this.filteredAppointments.map(app => [
      app.serviceName,
      app.userName || app.userId,
      app.barberName || 'Sin asignar',
      app.date,
      app.time,
      app.status === 'pending'
        ? 'Pendiente'
        : app.status === 'confirmed'
        ? 'Confirmada'
        : app.status === 'cancelled'
        ? 'Cancelada'
        : app.status
    ]);
    doc.text('Reporte de Turnos', 14, 18);
    autoTable(doc, {
      startY: 24,
      head: [columns],
      body: rows,
      styles: { fontSize: 11 },
      headStyles: { fillColor: [198, 172, 143] }
    });
    doc.save('turnos.pdf');
  }

  // --- EXPORTAR EXCEL ---
  exportarExcel() {
    const ws = XLSX.utils.json_to_sheet(
      this.filteredAppointments.map(app => ({
        Servicio: app.serviceName,
        Cliente: app.userName || app.userId,
        Barbero: app.barberName || 'Sin asignar',
        Fecha: app.date,
        Hora: app.time,
        Estado:
          app.status === 'pending'
            ? 'Pendiente'
            : app.status === 'confirmed'
            ? 'Confirmada'
            : app.status === 'cancelled'
            ? 'Cancelada'
            : app.status
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Turnos');
    XLSX.writeFile(wb, 'turnos.xlsx');
  }
}
