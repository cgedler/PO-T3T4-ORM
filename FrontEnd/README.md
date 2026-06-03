# Frontend (Angular)

### 1. Instalaci&#243;n y Creaci&#243;n del Proyecto

### 1.1 Instalar el CLI globalmente

```shell
npm install -g @angular/cli@18
```

### 2. Crear el proyecto

```shell
ng new sistema-academico-web
cd sistema-academico-web
```

### 3. Configuraci&#243;n del Cliente HTTP

**Archivo: `src/app/app.config.ts`**

```typescript

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient()
  ]
};

```

### 4. Crear el Servicio de Datos

```shell
ng generate service services/estudiante
```

**Archivo: `src/app/services/estudiante.service.ts`**

```typescript

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  private apiUrl = 'http://localhost:5263/api/Estudiantes';

  constructor(private http: HttpClient) { }

  getEstudiantes(token: string): Observable<any[]> {
    // Agregamos el Token JWT en las cabeceras
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  postEstudiante(estudiante: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, estudiante, { headers });
  }

}

```

### 5. Mostrar los datos en el Componente Principal

**Archivo: `src/app/app.component.ts`**

```typescript

import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Estudiantes';
}

```

### 6. El HTML

**Archivo: `src/app/app.component.html`**

```html

<h1>Estudiantes</h1>
<nav class="navbar">
  <a routerLink="/lista" routerLinkActive="active">Listado</a>
  <a routerLink="/registro" routerLinkActive="active">Registrar Nuevo</a>
</nav>

<hr>

<!-- Aquí es donde se cargarán tus componentes dinámicamente -->
<router-outlet></router-outlet>

```

**Archivo: `src/app/app.component.css`**

```css

/* Título principal */
h1 {
  text-align: center;
  font-family: "Segoe UI", Roboto, sans-serif;
  font-size: 2rem;
  color: #2c3e50;
  margin-top: 20px;
  margin-bottom: 25px;
}

/* Barra de navegación */
.navbar {
  display: flex;
  justify-content: center;
  gap: 25px;
  padding: 15px 0;
  background-color: #f0f4f8;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
}

/* Enlaces */
.navbar a {
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: #34495e;
  padding: 8px 14px;
  border-radius: 6px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Hover */
.navbar a:hover {
  background-color: #e1ecf7;
  color: #0078d4;
}

/* Enlace activo */
.navbar a.active {
  background-color: #0078d4;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 120, 212, 0.4);
}

/* Separador */
hr {
  margin: 25px 0;
  border: none;
  border-top: 1px solid #d0d7de;
}


```

### 7. Crear los componente listado y formulario

```shell
ng generate component lista-estudiantes

ng generate component formulario-estudiante
```

### 7.1 Modificamos `lista-estudiantes.component.ts` y `lista-estudiantes.component.html`

**Archivo: `src/app/lista-estudiantes/lista-estudiantes.component.ts`**

```typescript

import { Component, OnInit  } from '@angular/core';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { EstudianteService } from '../services/estudiante.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './lista-estudiantes.component.html',
  styleUrl: './lista-estudiantes.component.css'
})
export class ListaEstudiantesComponent implements OnInit {
  title = 'sistema-academico-web';

  estudiantes: any[] = [];
  token = '----';

  constructor(private estudianteService: EstudianteService) { }

  ngOnInit() {
    this.estudianteService.getEstudiantes(this.token).subscribe(data => {
      this.estudiantes = data;
    });
  }

}

```

> **`OnInit`**: segundo metodo que se ejecutra despues del constructor


**Archivo: `src/app/lista-estudiantes/lista-estudiantes.component.html`**

```html

<div class="container">
    <h1>Lista de Estudiantes (Desde .NET 8)</h1>
    <table border="1">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Cédula</th>
            </tr>
        </thead>
        <tbody>
            @for (e of estudiantes; track e.id) {
            <tr>
                <td>{{ e.nombre }}</td>
                <td>{{ e.cedula }}</td>
            </tr>
            } @empty {
            <tr>
                <td colspan="2">No hay estudiantes registrados.</td>
            </tr>
            }
        </tbody>
    </table>
</div>

<!--

<tr *ngFor="let e of estudiantes">
  <td>{{ e.nombre }}</td>
</tr>

-->

```

**Archivo: `src/app/lista-estudiantes/lista-estudiantes.component.css`**

```css

/* Estilo general del contenedor */
.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9fafc;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", Roboto, sans-serif;
}

/* Título */
.container h1 {
  text-align: center;
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 25px;
}

/* Tabla */
table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

/* Encabezado */
thead {
  background-color: #0078d4;
  color: #fff;
}

th {
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Filas */
td {
  padding: 10px 15px;
  border-bottom: 1px solid #e0e0e0;
}

/* Alternar color de filas */
tbody tr:nth-child(even) {
  background-color: #f3f6fa;
}

/* Hover */
tbody tr:hover {
  background-color: #e8f0fe;
  transition: background-color 0.3s ease;
}

/* Mensaje vacío */
td[colspan="2"] {
  text-align: center;
  color: #555;
  font-style: italic;
  background-color: #fdfdfd;
}

```

### 7.2 Modificamos `formulario-estudiante.component.ts` y `formulario-estudiante.component.html`

### Utilizamos Reactive Forms

- Importar los m&#243;dulos necesarios

- Debemos habilitar el soporte para formularios reactivos en tu archivo de m&#243;dulo.

- Aseg&#250;rate de que el componente donde trabajes importe `ReactiveFormsModule`.

**Archivo: `src/app/formulario-estudiante/formulario-estudiante.component.ts`**

```typescript

import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { EstudianteService } from '../services/estudiante.service';

@Component({
  selector: 'app-formulario-estudiante',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-estudiante.component.html',
  styleUrl: './formulario-estudiante.component.css'
})
export class FormularioEstudianteComponent {

  estudianteForm: FormGroup;
  title = 'formulario';

  token = '----';
  

  constructor(private estudianteService: EstudianteService) {
    // Definimos los campos y sus validaciones iniciales
    this.estudianteForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      cedula: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    if (this.estudianteForm.valid) {
      this.estudianteService.postEstudiante(this.estudianteForm.value, this.token).subscribe({
        next: (res) => {
          alert('Estudiante creado con éxito');
          this.estudianteForm.reset(); // Limpia el formulario
          // Aquí podrías llamar de nuevo a getEstudiantes() para refrescar la tabla
        },
        error: (err) => console.error('Error al crear', err)
      });
    }
  }

}

```

> Aqu&#237; creamos la estructura del formulario y la funci&#243;n para enviar los datos.

**Archivo: `src/app/formulario-estudiante/formulario-estudiante.component.html`**

```html

<div class="container">
    <h2>Registrar Nuevo Estudiante</h2>

    <form [formGroup]="estudianteForm" (ngSubmit)="onSubmit()">
        <div>
            <label>Nombre:</label>
            <input type="text" formControlName="nombre">
            @if (estudianteForm.get('nombre')?.invalid && estudianteForm.get('nombre')?.touched) {
            <small style="color: red;">El nombre es obligatorio.</small>
            } @else {
            <small>El nombre es correcto.</small>
            }
        </div>

        <div>
            <label>Cédula:</label>
            <input type="text" formControlName="cedula">
        </div>

        <button type="submit" [disabled]="estudianteForm.invalid">Guardar Estudiante</button>
    </form>

    <hr>
    <!-- Aquí abajo seguiría tu tabla de estudiantes para ver los resultados -->
</div>

<!--

<small *ngIf="estudianteForm.get('nombre')?.invalid" style="color: red;">
  El nombre es obligatorio.
</small>

-->

```

**Archivo: `src/app/formulario-estudiante/formulario-estudiante.component.css`**

```css

/* Contenedor general */
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 25px 30px;
  background-color: #f9fafc;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", Roboto, sans-serif;
}

/* Título */
.container h2 {
  text-align: center;
  color: #2c3e50;
  font-size: 1.6rem;
  margin-bottom: 25px;
}

/* Formulario */
form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Etiquetas y campos */
label {
  font-weight: 600;
  color: #34495e;
  display: block;
  margin-bottom: 6px;
}

input[type="text"] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

/* Efectos de foco */
input[type="text"]:focus {
  border-color: #0078d4;
  box-shadow: 0 0 5px rgba(0, 120, 212, 0.3);
  outline: none;
}

/* Mensajes de validación */
small {
  display: block;
  margin-top: 4px;
  font-size: 0.85rem;
}

small[style*="color: red"] {
  color: #e74c3c !important;
}

small:not([style*="color: red"]) {
  color: #2ecc71;
}

/* Botón */
button[type="submit"] {
  align-self: center;
  background-color: #0078d4;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #005fa3;
  transform: translateY(-2px);
}

button[type="submit"]:disabled {
  background-color: #b0c4de;
  cursor: not-allowed;
}

/* Separador */
hr {
  margin-top: 30px;
  border: none;
  border-top: 1px solid #ddd;
}

```

### 7.3 Definir las rutas en `app.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { ListaEstudiantesComponent } from './lista-estudiantes/lista-estudiantes.component';
import { FormularioEstudianteComponent } from './formulario-estudiante/formulario-estudiante.component';

export const routes: Routes = [
    { path: 'lista', component: ListaEstudiantesComponent },              // Ruta por defecto
    { path: 'registro', component: FormularioEstudianteComponent },   // Ruta del formulario
    { path: '**', redirectTo: '' }                                    // Comodín para rutas no encontradas
];

```

### 8. Configurar CORS *(En el Program.cs de tu proyecto C#)*

```csharp

builder.Services.AddCors(options => {
    options.AddPolicy("AllowAngular",
        policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// ... después de builder.Build()
app.UseCors("AllowAngular");


```

### 9. Ejecutar

```shell
ng serve --open
```