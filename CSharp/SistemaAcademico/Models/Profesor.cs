using System.ComponentModel.DataAnnotations;

namespace SistemaAcademico.Models;
public class Profesor {
    public int Id { get; set; }
    public required string Nombre { get; set; }
    public string? Email { get; set; }
    public string? Especialidad { get; set; }
    
    // Relación: Un profesor tiene muchas materias
    public List<Materia> Materias { get; set; } = [];
}