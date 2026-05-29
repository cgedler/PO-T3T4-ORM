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