import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // <-- Importa RouterModule aquí también
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // <-- AGREGA RouterModule aquí
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  email = '';
  password = '';
  name = '';
  errorMsg = '';
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  async register() {
    try {
      // 1. Crear usuario en Auth
      const userCred = await createUserWithEmailAndPassword(this.auth, this.email, this.password);

      // 2. Guardar datos adicionales en Firestore
      await setDoc(doc(this.firestore, 'users', userCred.user.uid), {
        name: this.name,
        email: this.email,
        role: 'cliente', // Siempre inicia como cliente
        createdAt: new Date()
      });

      // 3. Redirigir o mostrar mensaje
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.errorMsg = err.message || 'Error al registrar usuario';
    }
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}
