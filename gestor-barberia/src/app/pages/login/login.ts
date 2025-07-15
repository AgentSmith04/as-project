import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  submitted: boolean = false;

  onSubmit() {
    this.submitted = true;

    if (this.email.trim() && this.password.trim()) {
      alert('Inicio de sesión exitoso (simulado)');
    }
  }
}
