# Uso de los ORM

# Comandos

## Python 🐍

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

***

## C# ⚙

### 1. Preparar el Proyecto

```shell
dotnet new web -n SistemaAcademico
cd SistemaAcademico
```

### 2. Instalación de Dependencias

```shell

dotnet add package Microsoft.EntityFrameworkCore.Sqlite --version 8
dotnet add package Microsoft.EntityFrameworkCore.Tools --version 8
dotnet add package Microsoft.EntityFrameworkCore.Design --version 8

```

### 2.1 Estructura de las carpetas

```shell

SistemaAcademico/
│
├── Controllers/                # Lógica de control (Endpoints de la API)
│   └── EstudiantesController.cs
│
├── Data/                       # Todo lo relacionado con la persistencia
│   ├── UniversidadContext.cs   # El DbContext de EF Core
│   └── SeedData.cs             # (Opcional) Clase para la carga inicial
│
├── Migrations/                 # Generada automáticamente por EF Core
│   └── 20260428_InitialCreate.cs
│
├── Models/                     # Clases de dominio (POCOs)
│   ├── Estudiante.cs
│   ├── Profesor.cs
│   └── Materia.cs
│
├── Properties/
│   └── launchSettings.json     # Configuración de puertos y ejecución
│
├── appsettings.json            # Cadenas de conexión y configuración global
├── Program.cs                  # Configuración de la App e Inyección de Dependencias
└── universidad.db              # Base de datos SQLite (se crea al ejecutar)

```

### 6. Migraciones

#### Instalar la herramienta de línea de comandos de EF Core

```shell
dotnet tool install --global dotnet-ef
```

#### Paso A: Crear la Migración Inicial

```shell
dotnet ef migrations add InitialCreate
```
#### Paso B: Aplicar la Migración a la Base de Datos

```shell
dotnet ef database update
```

### 8. Implementar JWT (JSON Web Token)

#### Instalación del Paquete

```shell
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 8
```

# Frontend (Angular)

### 1. Instalación y Creación del Proyecto

#### Instalar el CLI globalmente

```shell
npm install -g @angular/cli@18
```

#### Crear el proyecto

```shell
ng new sistema-academico-web
cd sistema-academico-web
```

### 2. Configuración del Cliente HTTP

### 3. Crear el Servicio de Datos

```shell
ng generate service services/estudiante
```

### 4. Mostrar los datos en el Componente Principal

### 5. El HTML

### 6 Crear los componente listado y formulario

```shell
ng generate component lista-estudiantes

ng generate component formulario-estudiante
```

### 7 Configurar CORS

### 8 Ejecutar

```shell
ng serve --open
```