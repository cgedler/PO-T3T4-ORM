import { Routes } from '@angular/router';
import { ListaEstudiantesComponent } from './lista-estudiantes/lista-estudiantes.component';
import { FormularioEstudianteComponent } from './formulario-estudiante/formulario-estudiante.component';

export const routes: Routes = [
    { path: 'lista', component: ListaEstudiantesComponent },              // /
    { path: 'registro', component: FormularioEstudianteComponent },   // Ruta del formulario
    { path: '**', redirectTo: '' }                                    // Comodín para rutas no encontradas
];
