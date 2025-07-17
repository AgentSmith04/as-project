import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // <--- AGREGA ESTO


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule], // <--- Asegúrate de importar CommonModule
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppShell {
  userRole = localStorage.getItem('userRole'); // <--- Lee el rol del usuario

  logout() {
    localStorage.clear();
    window.location.href = '/';
  }
}
