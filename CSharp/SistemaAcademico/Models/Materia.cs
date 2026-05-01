using System.ComponentModel.DataAnnotations;

namespace SistemaAcademico.Models;
public class Materia {
    public int Id { get; set; }
    public required string Nombre { get; set; }
    
    // Clave Foránea automática
    public int ProfesorId { get; set; }
    public Profesor Profesor { get; set; } = null!;

    // Relación: Una materia tiene muchos estudiantes
    public List<Estudiante> Estudiantes { get; set; } = [];
}