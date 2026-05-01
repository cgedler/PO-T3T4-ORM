from django.db import models

# Create your models here.
class Profesor(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    especialidad = models.CharField(max_length=100)

    def __str__(self):
        return f"Prof. {self.nombre} {self.apellido}"

class Materia(models.Model):
    nombre = models.CharField(max_length=100)
    codigo = models.CharField(max_length=20, unique=True)
    # Un profesor puede dictar varias materias, pero una materia tiene un solo profesor titular
    profesor = models.ForeignKey(Profesor, on_delete=models.CASCADE, related_name='materias')

    def __str__(self):
        return self.nombre

class Estudiante(models.Model):
    nombre = models.CharField(max_length=100)
    cedula = models.CharField(max_length=15, unique=True)
    # Un estudiante se inscribe en muchas materias, y una materia tiene muchos estudiantes
    materias = models.ManyToManyField(Materia, related_name='estudiantes')

    def __str__(self):
        return f"{self.nombre} ({self.cedula})"