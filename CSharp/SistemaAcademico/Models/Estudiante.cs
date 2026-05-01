using System.ComponentModel.DataAnnotations;

namespace SistemaAcademico.Models;
public class Estudiante {
    public int Id { get; set; }
    public required string Nombre { get; set; }
    [MaxLength(15)]
    public required string Cedula { get; set; }

    // Relación Muchos a Muchos
    public List<Materia> Materias { get; set; } = [];
}