# Uso de los ORM con PHP 🐘 / Laravel

# Comandos


### 1. Crear un proyecto Laravel desde PowerShell:

```shell
composer create-project laravel/laravel mi_proyecto
```

### 1.1 Entrar al proyecto:

```shell
cd mi_proyecto
```

### 1.2 Levantar el servidor:

```shell
php artisan serve
```

### 2. Estructura de las carpetas

```shell
app/
│── Models/        ← Eloquent ORM
│── Http/
│     └── Controllers/  → lógica
database/
│── migrations/    ← Migraciones
routes/
│── web.php        ← Rutas
resources/
│── views/         ← Plantillas
```

### 3. Crear un modelo con migraci&#243;n (Eloquent)

```shell
php artisan make:model Usuario -m
```

**Esto crea:**

- `app/Models/Usuario.php`

- `database/migrations/xxxx_create_usuarios_table.php`


### 3.1 Modelo Eloquent (`app/Models/Usuario.php`):

```php

<?php

class Usuario extends Model
{
    protected $table = 'usuarios';

    protected $fillable = [
        'nombre',
        'email'
    ];
}
```

**`Estudiante.php`:**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Estudiante extends Model
{
    protected $fillable = ['nombre', 'cedula'];

    // Relación: Un estudiante se inscribe en muchas materias (Equivalente al ManyToManyField)
    public function materias(): BelongsToMany
    {
        return $this->belongsToMany(Materia::class, 'estudiante_materia');
    }
}
```

**`Materia.php`:**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Materia extends Model
{
    protected $fillable = ['nombre', 'codigo', 'profesor_id'];

    // Relación: Una materia pertenece a un profesor
    public function profesor(): BelongsTo
    {
        return $this->belongsTo(Profesor::class, 'profesor_id');
    }

    // Relación: Una materia pertenece a muchos estudiantes (Inversa de la relación N:N)
    public function estudiantes(): BelongsToMany
    {
        return $this->belongsToMany(Estudiante::class, 'estudiante_materia');
    }
}
```

**`Profesor.php`:**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Profesor extends Model
{
    // Laravel asume que la tabla se llama 'profesors' por el inglés, así; que especificamos el nombre en español:
    protected $table = 'profesores';
    
    protected $fillable = ['nombre', 'apellido', 'especialidad'];

    // Relación: Un profesor tiene muchas materias (Equivalente al related_name='materias')
    public function materias(): HasMany
    {
        return $this->hasMany(Materia::class, 'profesor_id');
    }
}
```

**Eloquent ya incluye:**

- `Usuario::all()`

- `Usuario::find($id)`

- `Usuario::create([...])`

- `Usuario::where(...)`


### 4. Migraci&#243;n (estructura de la tabla) agregar en `database/migrations/...create_usuarios_table.php`:

```php
public function up()
{
    Schema::create('usuarios', function (Blueprint $table) {
        $table->id();
        $table->string('nombre');
        $table->string('email')->unique();
        $table->timestamps();
    });


    Schema::create('profesores', function (Blueprint $table) {
        $table->id(); // Autoincremental (equivalente al id automático de Django)
        $table->string('nombre', 100);
        $table->string('apellido', 100);
        $table->string('especialidad', 100);
        $table->timestamps(); // Crea created_at y updated_at de forma nativa
    });

    Schema::create('materias', function (Blueprint $table) {
        $table->id();
        $table->string('nombre', 100);
        $table->string('codigo', 20)->unique(); // Restricción UNIQUE
    
        // Llave foránea (Equivalente al ForeignKey con on_delete=models.CASCADE)
        $table->foreignId('profesor_id')->constrained('profesores')->onDelete('cascade');
        $table->timestamps();
    });


    Schema::create('estudiantes', function (Blueprint $table) {
        $table->id();
        $table->string('nombre', 100);
        $table->string('cedula', 15)->unique(); // Restricción UNIQUE
        $table->timestamps();
    });

}
```

### 4.1 Ejecutar migraciones:

```shell
php artisan migrate

```

### 5. Controlador con CRUD

```shell
php artisan make:controller UsuarioController
```

### 5.1 Modificar en `app/Http/Controllers/UsuarioController.php`:

```php
<?php

use App\Models\Usuario;

class UsuarioController extends Controller
{
    public function index()
    {
        return Usuario::all();
    }

    public function store(Request $request)
    {
        return Usuario::create($request->all());
    }

    public function show($id)
    {
        return Usuario::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->update($request->all());
        return $usuario;
    }

    public function destroy($id)
    {
        Usuario::destroy($id);
        return ['mensaje' => 'Usuario eliminado'];
    }
}
```

### 6. Agregar rutas en (`routes/web.php`):

```php
use App\Http\Controllers\UsuarioController;

Route::get('/usuarios', [UsuarioController::class, 'index']);
Route::post('/usuarios', [UsuarioController::class, 'store']);
Route::get('/usuarios/{id}', [UsuarioController::class, 'show']);
Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);
Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy']);
```

### 7. Blade motor de plantillas nativo de Laravel:

- Los archivos deben tener la extensi&#243;n `.blade.php`.

- Se guardan estrictamente en la ruta: `resources/views/`.

### 7.1 Creando una Plantilla Base (**Layout**) crear el archivo `resources/views/layouts/app.blade.php`:

```php
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema Académico - @yield('titulo')</title>
    <!-- Aquí podrías meter Bootstrap o Tailwind -->
    <style>
        body { font-family: sans-serif; background: #f4f6f9; padding: 20px; }
        nav { background: #343a40; padding: 10px; border-radius: 5px; }
        nav a { color: white; margin-right: 15px; text-decoration: none; }
        .contenido { background: white; padding: 20px; margin-top: 20px; border-radius: 5px; }
    </style>
</head>
<body>

    <nav>
        <a href="#">Inicio</a>
        <a href="#">Profesores</a>
        <a href="#">Estudiantes</a>
    </nav>

    <div class="contenido">
        <!-- @yield le dice a Laravel: "Aquí va el contenido dinámico" -->
        @yield('contenido')
    </div>

</body>
</html>
```

### 7.3 Creando una Vista Hijo (Heredando el Layout) crear el archivo `resources/views/profesores/index.blade.php`:

```php
<!-- 1. Indicamos qué plantilla vamos a usar -->
@extends('layouts.app')

<!-- 2. Pasamos un texto simple al yield 'titulo' -->
@section('titulo', 'Lista de Profesores')

<!-- 3. Abrimos la sección para el bloque de contenido -->
@section('contenido')
    <h2>Panel de Profesores</h2>
    <p>Bienvenidos al listado oficial de la facultad.</p>

    <ul>
        <!-- Directiva de bucle nativa de Blade -->
        @foreach($profesores as $profesor)
            <li>Prof. {{ $profesor->nombre }} {{ $profesor->apellido }} - <strong>{{ $profesor->especialidad }}</strong></li>
        @endforeach
    </ul>
@endsection
```

### 7.4 Actualizar el Controlador (`ProfesorController.php`):

```php
<?php

namespace App\Http\Controllers;

use App\Models\Profesor;

class ProfesorController extends Controller
{
    public function index()
    {
        // Consultamos los datos usando Eloquent
        $profesores = Profesor::all();

        // Retornamos la vista. El punto (.) equivale a entrar a una carpeta
        return view('profesores.index', compact('profesores'));
    }
}
```
