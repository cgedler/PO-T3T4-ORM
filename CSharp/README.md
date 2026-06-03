# Uso de los ORM con C# ⚙ / EntityFramework

## Comandos

### 1. Preparar el Proyecto

```shell
dotnet new web -n SistemaAcademico
cd SistemaAcademico
```

### 2. Instalaci&#243;n de Dependencias

```shell

dotnet add package Microsoft.EntityFrameworkCore.Sqlite --version 8
dotnet add package Microsoft.EntityFrameworkCore.Tools --version 8
dotnet add package Microsoft.EntityFrameworkCore.Design --version 8

```

### 2.1 Estructura de las carpetas

```shell

SistemaAcademico/
│
├── Controllers/                # Lógica de control (Endpoints de la API)
│   └── EstudiantesController.cs
│
├── Data/                       # Todo lo relacionado con la persistencia
│   ├── UniversidadContext.cs   # El DbContext de EF Core
│   └── SeedData.cs             # (Opcional) Clase para la carga inicial
│
├── Migrations/                 # Generada automáticamente por EF Core
│   └── 20260428_InitialCreate.cs
│
├── Models/                     # Clases de dominio (POCOs)
│   ├── Estudiante.cs
│   ├── Profesor.cs
│   └── Materia.cs
│
├── Properties/
│   └── launchSettings.json     # Configuración de puertos y ejecución
│
├── appsettings.json            # Cadenas de conexión y configuración global
├── Program.cs                  # Configuración de la App e Inyección de Dependencias
└── universidad.db              # Base de datos SQLite (se crea al ejecutar)

```


### 3. Los Modelos (Entidades)

En EF Core, usamos propiedades virtuales para habilitar la "Carga Diferida" (Lazy Loading) o simplemente para definir las relaciones.


**Profesor:**

```csharp

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

```

**Materia:**

```csharp

using System.ComponentModel.DataAnnotations;

public class Materia {
    public int Id { get; set; }
    public required string Nombre { get; set; }
    
    // Clave Foránea automática
    public int ProfesorId { get; set; }
    public Profesor Profesor { get; set; } = null!;

    // Relación: Una materia tiene muchos estudiantes
    public List<Estudiante> Estudiantes { get; set; } = [];
}
```

**Estudiante:**

```csharp

using System.ComponentModel.DataAnnotations;

public class Estudiante {
    public int Id { get; set; }
    public required string Nombre { get; set; }
    [MaxLength(15)]
    public required string Cedula { get; set; }

    // Relación Muchos a Muchos
    public List<Materia> Materias { get; set; } = [];
}

```

### 4. El Contexto de la Base de Datos (DbContext)

Este es el "coraz&#243;n" de EF Core. Es la clase que representa la sesi&#243;n con la base de datos.

```csharp

using Microsoft.EntityFrameworkCore;
using SistemaAcademico.Models;

namespace SistemaAcademico.Data;

public class UniversidadContext : DbContext {
    public DbSet<Profesor> Profesores { get; set; }
    public DbSet<Materia> Materias { get; set; }
    public DbSet<Estudiante> Estudiantes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite("Data Source=universidad.db");
}

```

### 5. Uso en Program.cs (Minimal API)

```csharp

var builder = WebApplication.CreateBuilder(args);

// REGISTRAR LOS SERVICIOS DE CONTROLADORES
builder.Services.AddControllers();

// Registrar el DbContext
builder.Services.AddDbContext<UniversidadContext>();

var app = builder.Build();

// MAPEAR LAS RUTAS DE LOS CONTROLADORES
app.MapControllers();

// Crear la base de datos automáticamente si no existe
using (var scope = app.Services.CreateScope()) {
    var db = scope.ServiceProvider.GetRequiredService<UniversidadContext>();
    db.Database.EnsureCreated();
}

app.MapGet("/inscripciones", async (UniversidadContext db) => {
    return await db.Estudiantes
        .Include(e => e.Materias)           // Carga las materias
            .ThenInclude(m => m.Profesor)   // Carga el profesor de cada materia
        .ToListAsync();
});

app.Run();

```


### 6. Migraciones

> Una migraci&#243;n es como un "Control de Versiones (Git) para la base de datos". En lugar de borrar la base de datos y volverla a crear, EF Core genera un archivo de c&#243;digo C# que describe los cambios exactos (ej: "Agregar columna FechaInscripcion").

### 6.1 Instalar la herramienta de l&#237;nea de comandos de EF Core

```shell
dotnet tool install --global dotnet-ef
```

### 6.1.2 Paso A: Crear la Migraci&#243;n Inicial

```shell
dotnet ef migrations add InitialCreate
```
### 6.1.3 Paso B: Aplicar la Migraci&#243;n a la Base de Datos

```shell
dotnet ef database update
```

### 7. Agregar Controlador

```csharp

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

```

### 8. Implementar JWT (JSON Web Token)

### 8.1 Instalaci&#243;n del Paquete

```shell
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 8
```

### 8.2 Configuraci&#243;n en Program.cs

> Aqu&#237; definimos la "llave" maestra que firmar&#225; nuestros tokens.

```csharp

using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// CLAVE SECRETA (En producción, esto va en appsettings.json o Variables de Entorno)
var key = Encoding.ASCII.GetBytes("EstaDebeSerUnaClaveMuyLargaYSuperSecreta2026");

builder.Services.AddAuthentication(x => {
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x => {
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

builder.Services.AddControllers();
builder.Services.AddDbContext<UniversidadContext>();

var app = builder.Build();

app.UseAuthentication(); // ¿Quién eres?
app.UseAuthorization();  // ¿A qué tienes permiso?

app.MapControllers();
app.Run();

```

### 8.3 El Controlador de Autenticaci&#243;n (AuthController.cs)

> Este es el endpoint donde el usuario env&#237;a sus credenciales y recibe el token.

> **Simulaci&#243;n:** En un caso real, validar&#237;as contra la base de datos (BCrypt)

```csharp

using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase {
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest login) {

        if (login.Usuario == "profesor" && login.Password == "admin123") {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("EstaDebeSerUnaClaveMuyLargaYSuperSecreta2026");
            
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(new[] { new Claim("id", "1"), new Claim(ClaimTypes.Role, "Admin") }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return Ok(new { token = tokenHandler.WriteToken(token) });
        }
        return Unauthorized();
    }
}

public class LoginRequest {
    public string Usuario { get; set; } = "";
    public string Password { get; set; } = "";
}

```

### 8.4 Proteger los Endpoints existentes

> Ahora, para que nadie pueda borrar un estudiante sin estar logueado, ve a tu `EstudiantesController.cs` y a&#241;ade el atributo `[Authorize]`:

```csharp

using Microsoft.AspNetCore.Authorization;

[Authorize] // <--- Esto bloquea el acceso a toda la clase
[Route("api/[controller]")]
[ApiController]
public class EstudiantesController : ControllerBase { ... }

```