import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminComponent {
  users = [
    { id: 1, name: 'Kevin Nivesela', email: 'kevin@mail.com', role: 'Administrador' },
    { id: 2, name: 'Ana Torres', email: 'ana@mail.com', role: 'Barbero' },
    { id: 3, name: 'Luis Mena', email: 'luis@mail.com', role: 'Cliente' }
  ];

  deleteUser(id: number) {
    alert(`Eliminar usuario con ID ${id} (simulado)`);
  }

  blockUser(id: number) {
    alert(`Bloquear usuario con ID ${id} (simulado)`);
  }

  editUser(id: number) {
    alert(`Editar usuario con ID ${id} (simulado)`);
  }
}
