from django.contrib import admin
from .models import Profesor, Materia, Estudiante

@admin.register(Profesor)
class ProfesorAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'apellido', 'especialidad')
    search_fields = ('nombre', 'apellido')

@admin.register(Materia)
class MateriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'codigo', 'profesor')
    list_filter = ('profesor',) # Filtro lateral por profesor
    search_fields = ('nombre', 'codigo')

@admin.register(Estudiante)
class EstudianteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'cedula')
    search_fields = ('nombre', 'cedula')
    # Esto permite seleccionar las materias de forma mucho más cómoda
    filter_horizontal = ('materias',)
