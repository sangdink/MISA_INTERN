using MISA.WebIntern.Insfrastructure.Interfaces;
using MISA.WebIntern.Insfrastructure.MISADatabaseContext;
using MISA.WebIntern.Insfrastructure.Repository;
using MISA.WenIntern.Core;
using MISA.WenIntern.Core.Exceptions;
using MISA.WenIntern.Core.Interfaces;
using MISA.WenIntern.Core.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
Common.ConnectionString = builder.Configuration.GetConnectionString("Database3");

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Config DI:
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();

builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IMISADbContext, MariaDbContext>(); 

builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<HandleExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
