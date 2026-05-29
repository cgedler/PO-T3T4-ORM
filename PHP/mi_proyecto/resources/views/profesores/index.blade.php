<!-- 1. Indicamos qué plantilla vamos a usar -->
@extends('layouts.app')

<!-- 2. Pasamos un texto simple al yield 'titulo' -->
@section('titulo', 'Lista de Profesores')

<!-- 3. Abrimos la sección para el bloque de contenido -->
@section('contenido')
    <h2>Panel de Profesores</h2>
    <p>Bienvenidos al listado de Profesores.</p>

    <ul>
        <!-- Directiva de bucle nativa de Blade -->
        @foreach($profesores as $profesor)
            <li>Prof. {{ $profesor->nombre }} {{ $profesor->apellido }} - <strong>{{ $profesor->especialidad }}</strong></li>
        @endforeach
    </ul>
@endsection