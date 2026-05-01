using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaAcademico.Data;
using SistemaAcademico.Models;
using Microsoft.AspNetCore.Authorization;

namespace SistemaAcademico.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class EstudiantesController : ControllerBase
{
    private readonly UniversidadContext _context;

    public EstudiantesController(UniversidadContext context)
    {
        _context = context;
    }

    // 1. GET: api/Estudiantes (Leer todos)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Estudiante>>> GetEstudiantes()
    {
        return await _context.Estudiantes.Include(e => e.Materias).ToListAsync();
    }

    // 2. GET: api/Estudiantes/5 (Leer uno solo)
    [HttpGet("{id}")]
    public async Task<ActionResult<Estudiante>> GetEstudiante(int id)
    {
        var estudiante = await _context.Estudiantes
            .Include(e => e.Materias)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (estudiante == null) return NotFound();
        return estudiante;
    }

    // 3. POST: api/Estudiantes (Crear)
    [HttpPost]
    public async Task<ActionResult<Estudiante>> PostEstudiante(Estudiante estudiante)
    {
        _context.Estudiantes.Add(estudiante);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEstudiante), new { id = estudiante.Id }, estudiante);
    }

    // 4. PUT: api/Estudiantes/5 (Actualizar)
    [HttpPut("{id}")]
    public async Task<IActionResult> PutEstudiante(int id, Estudiante estudiante)
    {
        if (id != estudiante.Id) return BadRequest();

        _context.Entry(estudiante).State = EntityState.Modified;

        try {
            await _context.SaveChangesAsync();
        } catch (DbUpdateConcurrencyException) {
            if (!_context.Estudiantes.Any(e => e.Id == id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    // 5. DELETE: api/Estudiantes/5 (Eliminar)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEstudiante(int id)
    {
        var estudiante = await _context.Estudiantes.FindAsync(id);
        if (estudiante == null) return NotFound();

        _context.Estudiantes.Remove(estudiante);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}