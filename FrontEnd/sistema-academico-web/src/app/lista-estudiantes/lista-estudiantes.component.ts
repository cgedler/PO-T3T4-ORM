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
  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJyb2xlIjoiQWRtaW4iLCJuYmYiOjE3Nzc2ODUxMTcsImV4cCI6MTc3NzY4ODcxNywiaWF0IjoxNzc3Njg1MTE3fQ.CrA05n_WIFLspKeINV5-tJ7TBObRZ0FpR8QFX76kh34';

  constructor(private estudianteService: EstudianteService) { }

  ngOnInit() {
    this.estudianteService.getEstudiantes(this.token).subscribe(data => {
      this.estudiantes = data;
    });
  }

}
