import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  constructor(private router: Router) {}

  get userRole() { return localStorage.getItem('userRole'); }

  // Si quieres usar botón programático
  goToAgendar() {
    this.router.navigate(['/agendar']);
  }
}
