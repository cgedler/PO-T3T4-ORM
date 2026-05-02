using SistemaAcademico.Data;
using SistemaAcademico.Models;
using Microsoft.EntityFrameworkCore;
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

builder.Services.AddCors(options => {
    options.AddPolicy("AllowAngular",
        policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// REGISTRAR LOS SERVICIOS DE CONTROLADORES
builder.Services.AddControllers();

// Registrar el DbContext
builder.Services.AddDbContext<UniversidadContext>();

var app = builder.Build();

app.UseCors("AllowAngular");

app.UseAuthentication(); // ¿Quién eres?
app.UseAuthorization();  // ¿A qué tienes permiso?


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
