import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from '@angular/fire/auth';

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cambiar-password.html',
})
export class CambiarPasswordComponent {
  actualPassword = '';
  nuevaPassword = '';
  mensaje = '';
  error = '';
  constructor(private auth: Auth) {}

  async cambiarPassword() {
    this.mensaje = '';
    this.error = '';

    const user = this.auth.currentUser;
    if (!user || !user.email) {
      this.error = 'Debes estar logueado.';
      return;
    }

    try {
      // Reautentica al usuario
      const cred = EmailAuthProvider.credential(user.email, this.actualPassword);
      await reauthenticateWithCredential(user, cred);

      // Cambia la contraseña
      await updatePassword(user, this.nuevaPassword);
      this.mensaje = 'Contraseña actualizada correctamente.';
      this.actualPassword = '';
      this.nuevaPassword = '';
    } catch (err: any) {
      if (err.code === 'auth/wrong-password') {
        this.error = 'La contraseña actual es incorrecta.';
      } else {
        this.error = err.message || 'Error al actualizar la contraseña.';
      }
    }
  }
}
