import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent) },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent) },
  { path: 'barbers', loadComponent: () => import('./pages/barbers/barbers').then(m => m.BarbersComponent) }, // <--- ESTA ES LA NUEVA
  { path: 'cambiar-password', loadComponent: () => import('./pages/perfil/cambiar-password').then(m => m.CambiarPasswordComponent) },
  { path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent) },
  { path: 'admin-services', loadComponent: () => import('./pages/admin-services/admin-services').then(m => m.AdminServicesComponent) },
  { path: 'agendar', loadComponent: () => import('./pages/agendar/agendar').then(m => m.AgendarComponent) },
  { path: 'barbero', loadComponent: () => import('./pages/barbero/barbero').then(m => m.BarberoComponent) },
  { path: 'mis-turnos', loadComponent: () => import('./pages/mis-turnos/mis-turnos').then(m => m.MisTurnosComponent) }, // <--- NUEVO RUTA PARA MIS TURNOS
  { path: 'admin-appointments', loadComponent: () => import('./pages/admin.appointments/admin-appointments').then(m => m.AdminAppointmentsComponent) }, // <--- NUEVO RUTA PARA ADMIN APPOINTMENTS
];
