import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPasswordComponent {
  email = '';
  message = '';
  error = '';
  private auth = inject(Auth);

  async sendResetEmail() {
    this.message = '';
    this.error = '';
    try {
      await sendPasswordResetEmail(this.auth, this.email);
      this.message = 'Se ha enviado un correo de recuperación de contraseña.';
    } catch (err: any) {
      this.error = err.message || 'Ocurrió un error. Verifica el email.';
    }
  }
}
