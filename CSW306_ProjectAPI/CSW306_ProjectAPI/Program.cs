using CSW306_ProjectAPI.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<CSW306_ProjectAPIContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBConnection")));


var app = builder.Build();

app.UseStaticFiles();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
