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
        <!-- @ yield le dice a Laravel: "Aquí va el contenido dinámico" -->
        @yield('contenido')
    </div>

</body>
</html>