from django.shortcuts import render, redirect
from .models import Estudiante
from .forms import InscripcionForm

def lista_estudiantes(request):
    # Usamos prefetch_related para optimizar la consulta y evitar el problema de N+1 queries
    estudiantes = Estudiante.objects.all().prefetch_related('materias__profesor')
    return render(request, 'lista_estudiantes.html', {'estudiantes': estudiantes})

def inscripcion_view(request):
    if request.method == 'POST':
        form = InscripcionForm(request.POST)
        if form.is_valid():
            form.save() # Guarda el estudiante y crea las relaciones ManyToMany
            return redirect('lista_estudiantes') # Redirige a la tabla que hicimos antes
    else:
        form = InscripcionForm()
    
    return render(request, 'inscripcion.html', {'form': form})