<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Profesor extends Model
{
    // Laravel asume que la tabla se llama 'profesors' por el inglés, así que especificamos el nombre en español:
    protected $table = 'profesores';
    
    protected $fillable = ['nombre', 'apellido', 'especialidad'];

    // Relación: Un profesor tiene muchas materias (Equivalente al related_name='materias')
    public function materias(): HasMany
    {
        return $this->hasMany(Materia::class, 'profesor_id');
    }
}