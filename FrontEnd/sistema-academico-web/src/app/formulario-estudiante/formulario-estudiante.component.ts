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

  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJyb2xlIjoiQWRtaW4iLCJuYmYiOjE3Nzc2ODUxMTcsImV4cCI6MTc3NzY4ODcxNywiaWF0IjoxNzc3Njg1MTE3fQ.CrA05n_WIFLspKeINV5-tJ7TBObRZ0FpR8QFX76kh34';
  

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