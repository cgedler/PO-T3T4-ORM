# Uso de los ORM con Python 🐍 / Django

## Comandos

### 1. Crear el entorno virtual

```shell
virtualenv venv
```

### 2. Activarlo

#### Linux

```shell
source venv/bin/activate
```

#### Windows

```shell
.\venv\Scripts\activate
```

### 2.1 Desactivarlo con: 

```shell
deactivate
```

### 3. Instalar Django

```shell
pip install django
```

### 4. Verificar version de Django

```shell
python -m django --version
```

### 5. Crear Proyecto

```shell
django-admin startproject miproyecto
```

### 6. Crear APP

```shell
django-admin startapp GestionAlumnos
```

**Agregamos en `settings.py`**

```python
  'GestionAlumnos'
```


### 6.1 Estructura de las carpetas

```shell
miproyecto/               # Carpeta contenedora principal
│
├── manage.py             # Utilidad de l&#237;nea de comandos para administrar el proyecto
│
├── miproyecto/           # Carpeta de configuraci&#243;n global del proyecto
│   ├── __init__.py       # Archivo que indica que este directorio es un paquete Python
│   ├── settings.py       # Configuraci&#243;n principal (base de datos, apps instaladas, etc.)
│   ├── urls.py           # Enrutador de URLs a nivel de proyecto
│   ├── asgi.py           # Configuraci&#243;n para despliegue as&#237;ncrono
│   └── wsgi.py           # Configuraci&#243;n para despliegue web tradicional
│
└── GestionAlumnos/       # Carpeta de una aplicaci&#243;n espec&#237;fica (ej. usuarios, blog)
    ├── migrations/       # Carpeta con los archivos de historial de la base de datos
    ├── __init__.py
    ├── admin.py          # Registro de modelos para el panel de administraci&#243;n
    ├── apps.py           # Configuraci&#243;n espec&#237;fica de la aplicaci&#243;n
    ├── models.py         # Definici&#243;n de las estructuras de datos (Base de datos)
    ├── tests.py          # Pruebas unitarias
    ├── views.py          # L&#243;gica de negocio (vistas de tu aplicaci&#243;n)
    └── forms.py          # Este archivo te permite capturar, validar y procesar datos enviados por los usuarios de una manera segura y eficiente.
```

### 6.2 Ejemplo de Modelos (`models.py`):

```python
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
```

### 6.3 Agregar los modelos al Admin (`admin.py`):

```python
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
    # Esto permite seleccionar las materias de forma mucho m&#225;s c&#243;moda
    filter_horizontal = ('materias',)
```

### 7. Crear archivo SQL para la DB

```shell
python manage.py makemigrations
```

### 8. Ejecutar el SQL en la DB

```shell
python manage.py migrate
```

### 9. Crear el super usuario

```shell
python manage.py createsuperuser
```

### 10. Ejecutar el proyecto

```shell
python manage.py runserver
```

### 11. Usar el Shell

```shell
python manage.py shell
```

### 12. Usar los Templates View

### 12.1 Crear la carpeta *`templates`* y el archivo html *`templates/lista_estudiantes.html`*:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Listado de Estudiantes e Inscripciones</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<body class="container mt-5">
    <h2 class="mb-4">Control de Inscripciones Académicas</h2>
    
    <table class="table table-striped table-hover">
        <thead class="table-dark">
            <tr>
                <th>Cédula</th>
                <th>Estudiante</th>
                <th>Materias Inscritas</th>
                <th>Profesores Asignados</th>
            </tr>
        </thead>
        <tbody>
            {% for estudiante in estudiantes %}
            <tr>
                <td>{{ estudiante.cedula }}</td>
                <td><strong>{{ estudiante.nombre }}</strong></td>
                <td>
                    <ul class="list-unstyled">
                        {% for materia in estudiante.materias.all %}
                            <li>{{ materia.nombre }} ({{ materia.codigo }})</li>
                        {% empty %}
                            <li class="text-muted">Sin materias</li>
                        {% endfor %}
                    </ul>
                </td>
                <td>
                    <ul class="list-unstyled">
                        {% for materia in estudiante.materias.all %}
                            <li>{{ materia.profesor.nombre }} {{ materia.profesor.apellido }}</li>
                        {% endfor %}
                    </ul>
                </td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
</body>
</html>
```

### 12.2 Agregar la vista en (`views.py`):

```python
from django.shortcuts import render
from .models import Estudiante

def lista_estudiantes(request):
    # Usamos prefetch_related para optimizar la consulta y evitar el problema de N+1 queries
    estudiantes = Estudiante.objects.all().prefetch_related('materias__profesor')
    return render(request, 'lista_estudiantes.html', {'estudiantes': estudiantes})
```

### 12.3 Agregar la ruta en (`urls.py`):

```python
from django.contrib import admin
from django.urls import path
from GestionAlumnos.views import lista_estudiantes

urlpatterns = [
    path('admin/', admin.site.urls),
    path('estudiantes/', lista_estudiantes, name='lista_estudiantes'),
]
```

### 13. Formularios

### 13.1 Crear el Formulario (`forms.py`):


```python
from django import forms
from .models import Estudiante

class InscripcionForm(forms.ModelForm):
    class Meta:
        model = Estudiante
        fields = ['nombre', 'cedula', 'materias']
        # Usamos widgets para aplicar clases de Bootstrap y mejorar el dise&#241;o
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'form-control'}),
            'cedula': forms.TextInput(attrs={'class': 'form-control'}),
            'materias': forms.SelectMultiple(attrs={'class': 'form-control'}),
        }
```

### 13.2 Actualizar la vista en (`views.py`) a&#241;adir:

```python
from django.shortcuts import render, redirect
from .models import Estudiante
from .forms import InscripcionForm

def inscripcion_view(request):
    if request.method == 'POST':
        form = InscripcionForm(request.POST)
        if form.is_valid():
            form.save() # Guarda el estudiante y crea las relaciones ManyToMany
            return redirect('lista_estudiantes') # Redirige a la tabla que hicimos antes
    else:
        form = InscripcionForm()
    
    return render(request, 'inscripcion.html', {'form': form})
```

### 13.3 Crear el Template para el formulario *`templates/inscripcion.html`*:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Inscripci&#243;n de Estudiantes</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<body class="container mt-5">
    <div class="card shadow">
        <div class="card-header bg-primary text-white">
            <h3 class="mb-0">Nueva Inscripci&#243;n</h3>
        </div>
        <div class="card-body">
            <form method="post">
                {% csrf_token %}
                {{ form.as_p }}
                <div class="mt-4">
                    <button type="submit" class="btn btn-success">Registrar Estudiante</button>
                    <a href="{% url 'lista_estudiantes' %}" class="btn btn-secondary">Volver al Listado</a>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
```

> `{% csrf_token %}`
> **Django** incluye protecci&#243;n contra ataques de tipo Cross-Site Request Forgery de forma obligatoria en todos los formularios POST.


### 13.4 Actualizar la ruta en (`urls.py`) a&#241;adir:

```python
path('inscripcion/', inscripcion_view, name='inscripcion_estudiante'),
```


### 14.s Agregamos nuevo archivo `db.py`:

```python

import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# SQLITE
SQLITE = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
# POSTGRESQL
POSTGRESQL = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'prueba',
        'USER': 'cge',
        'PASSWORD': '123456',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}
# MYSQL
MYSQL = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'prueba',
        'USER': 'root',
        'PASSWORD': '123456',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

#MSSQL
MSSQL = {
    'default': {
        'ENGINE': 'mssql',
        'NAME': 'prueba',
        'USER': 'cge',
        'PASSWORD': '123456',
        'HOST': 'localhost', #DESKTOP\SQLEXPRESS
        'PORT': '1433',
        'OPTIONS': {
            'driver': 'ODBC Driver 17 for SQL Server',
            'trusted_connection': 'yes',
        },
    },
}
```

**Agregamos en `settings.py`**

```python
# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

import miproyecto.db as db
#DATABASES = db.POSTGRESQL
DATABASES = db.SQLITE
#DATABASES = db.MYSQL
#DATABASES = db.MSSQL
```
