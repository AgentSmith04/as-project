import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppShell {
  // Usamos getters para que el valor se actualice dinámicamente si cambia el localStorage
  get userRole(): string | null {
    return localStorage.getItem('userRole');
  }

  get userUid(): string | null {
    return localStorage.getItem('userUid');
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}
