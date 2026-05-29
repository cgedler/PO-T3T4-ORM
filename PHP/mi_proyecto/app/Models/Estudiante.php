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