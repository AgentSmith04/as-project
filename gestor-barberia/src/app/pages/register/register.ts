import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  submitted = false;

  onSubmit() {
    this.submitted = true;

    if (
      this.name.trim() &&
      this.email.trim() &&
      this.password &&
      this.confirmPassword &&
      this.password === this.confirmPassword
    ) {
      alert('Registro exitoso (simulado)');
    }
  }
}
