import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, updateDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// IMPORTS PARA EXPORTAR
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminComponent implements OnInit {
  users$: Observable<any[]>;
  allUsers: any[] = [];
  filteredUsers: any[] = [];
  private firestore = inject(Firestore);

  editMode = false;
  currentUser: any = {};
  filterRole: string = '';

  constructor() {
    const usersCollection = collection(this.firestore, 'users');
    this.users$ = collectionData(usersCollection, { idField: 'id' });

    this.users$.subscribe(users => {
      this.allUsers = users;
      this.applyRoleFilter();
    });
  }

  ngOnInit() {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      window.location.href = '/';
    }
  }

  applyRoleFilter() {
    if (this.filterRole) {
      this.filteredUsers = this.allUsers.filter(user => user.role === this.filterRole);
    } else {
      this.filteredUsers = this.allUsers;
    }
  }

  onFilterRoleChange() {
    this.applyRoleFilter();
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

  onRoleChange(userId: string, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement && selectElement.value) {
      this.cambiarRol(userId, selectElement.value);
    }
  }

  async cambiarRol(userId: string, nuevoRol: string) {
    const userDoc = doc(this.firestore, 'users', userId);
    await updateDoc(userDoc, { role: nuevoRol });
  }

  // EXPORTAR PDF
  exportarPDF() {
    const doc = new jsPDF();
    const columns = ['ID', 'Nombre', 'Correo', 'Rol'];
    const rows = this.filteredUsers.map(u => [u.id, u.name, u.email, u.role]);
    doc.text('Reporte de Usuarios', 14, 18);
    autoTable(doc, {
      startY: 24,
      head: [columns],
      body: rows,
      styles: { fontSize: 11 },
      headStyles: { fillColor: [198, 172, 143] }
    });
    doc.save('usuarios.pdf');
  }

  // EXPORTAR EXCEL
  exportarExcel() {
    const ws = XLSX.utils.json_to_sheet(
      this.filteredUsers.map(u => ({
        ID: u.id,
        Nombre: u.name,
        Correo: u.email,
        Rol: u.role
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
    XLSX.writeFile(wb, 'usuarios.xlsx');
  }
}
