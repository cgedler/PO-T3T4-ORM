<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
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

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profesores');
        Schema::dropIfExists('materias');
        Schema::dropIfExists('estudiantes');
    }
};
