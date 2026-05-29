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