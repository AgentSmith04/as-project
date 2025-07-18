import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  async login() {
    try {
      // 1. Inicia sesión con Auth
      const userCred = await signInWithEmailAndPassword(this.auth, this.email, this.password);

      // 2. Busca el perfil del usuario en Firestore
      const userDocRef = doc(this.firestore, 'users', userCred.user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        // 3. Guarda el rol y datos clave en localStorage
        localStorage.setItem('userRole', userData['role']);
        localStorage.setItem('userUid', userCred.user.uid);
        localStorage.setItem('userName', userData['name'] || '');

        // 4. Redirige según el rol
        if (userData['role'] === 'admin') {
          this.router.navigate(['/admin']);
        } else if (userData['role'] === 'barbero') {
          this.router.navigate(['/barbero']); // crea esta ruta luego
        } else {
          this.router.navigate(['/']); // cliente
        }

        // 5. Limpia el formulario (opcional)
        this.email = '';
        this.password = '';
        this.errorMsg = '';
        // (opcional) recarga la página para forzar que el menú cambie
        // location.reload();
      } else {
        this.errorMsg = 'Usuario sin perfil en Firestore';
      }
    } catch (err: any) {
      this.errorMsg = err.message || 'Error al iniciar sesión';
    }
  }
}
