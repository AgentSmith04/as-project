import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, addDoc, query, where } from '@angular/fire/firestore';
import { Observable, firstValueFrom, timeout, catchError, of } from 'rxjs';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agendar.html',
  styleUrls: ['./agendar.scss']
})
export class AgendarComponent implements OnInit {
  services$: Observable<any[]>;
  private firestore = inject(Firestore);

  selectedService: any = null;
  selectedDate = '';
  selectedTime = '';
  errorMsg = '';
  successMsg = '';
  horarios = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  constructor() {
    const servicesCollection = collection(this.firestore, 'services');
    this.services$ = collectionData(query(servicesCollection, where('active', '==', true)), { idField: 'id' });
  }

  ngOnInit() {
    if (!localStorage.getItem('userUid')) {
      window.location.href = '/login';
    }
  }

  selectService(service: any) {
    this.selectedService = service;
    this.selectedDate = '';
    this.selectedTime = '';
    this.errorMsg = '';
    this.successMsg = '';
  }

  cancelar() {
    this.selectedService = null;
    this.selectedDate = '';
    this.selectedTime = '';
    this.errorMsg = '';
    this.successMsg = '';
  }

  async agendarTurno() {
    this.errorMsg = '';
    this.successMsg = '';
    if (!this.selectedService) {
      this.errorMsg = 'Selecciona un servicio primero.';
      return;
    }
    if (!this.selectedDate || !this.selectedTime) {
      this.errorMsg = 'Selecciona fecha y hora.';
      return;
    }

    try {
      // PASO 1: Verificar si ya existe el turno
      const appointmentsCollection = collection(this.firestore, 'appointments');
      const q = query(
        appointmentsCollection,
        where('serviceId', '==', this.selectedService.id),
        where('date', '==', this.selectedDate),
        where('time', '==', this.selectedTime),
        where('status', 'in', ['pending', 'confirmed'])
      );

      let docs: any[] = [];
      try {
        docs = await firstValueFrom(
          collectionData(q).pipe(
            timeout(5000),
            catchError(err => {
              this.errorMsg = 'No se pudo conectar con Firestore para verificar disponibilidad.';
              return of([]); // Permite continuar para mostrar mensaje
            })
          )
        );
      } catch (timeoutErr) {
        this.errorMsg = 'Timeout consultando Firestore.';
        return;
      }

      if (docs && docs.length > 0) {
        this.errorMsg = 'Ese horario ya está reservado. Intenta con otra hora o fecha.';
        // NO limpies selectedService aquí, para que el usuario pueda volver a intentar
        return;
      }

      // PASO 2: Crear el turno
      const userId = localStorage.getItem('userUid') || '';
      const userName = localStorage.getItem('userName') || '';

      await addDoc(appointmentsCollection, {
        serviceId: this.selectedService.id,
        serviceName: this.selectedService.name,
        userId,
        userName,
        date: this.selectedDate,
        time: this.selectedTime,
        status: 'pending',
        createdAt: new Date()
      });

      this.successMsg = '¡Turno reservado! Espera confirmación.';
      // Limpia campos SOLO después de éxito
      this.selectedDate = '';
      this.selectedTime = '';
      this.selectedService = null;
    } catch (err: any) {
      this.errorMsg = 'Error inesperado: ' + (err.message || err);
    }
  }
}
