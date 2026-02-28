using CSW306.Domain.Entities;
using CSW306.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped<CSW306.Application.Interfaces.IUnitOfWork, CSW306.Infrastructure.Repositories.UnitOfWork>();

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        });
builder.Services.AddScoped<CSW306.Application.Interfaces.IRepositories.ICategoryRepository, CSW306.Infrastructure.Repositories.CategoryRepository>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IRepositories.IItemRepository, CSW306.Infrastructure.Repositories.ItemRepository>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IRepositories.ITableRepository, CSW306.Infrastructure.Repositories.TableRepository>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IRepositories.IUserRepository, CSW306.Infrastructure.Repositories.UserRepository>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IRepositories.IReservationRepository, CSW306.Infrastructure.Repositories.ReservationRepository>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IRepositories.IPaymentRepository, CSW306.Infrastructure.Repositories.PaymentRepository>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IRepositories.IDiscountRepository, CSW306.Infrastructure.Repositories.DiscountRepository>();


builder.Services.AddScoped<CSW306.Application.Interfaces.IServices.ICategoryService, CSW306.Application.Services.CategoryService>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IServices.IItemService, CSW306.Application.Services.ItemService>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IServices.IOrderService, CSW306.Application.Services.OrderService>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IServices.IAuthService, CSW306.Application.Services.AuthService>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IServices.ITableService, CSW306.Application.Services.TableService>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IServices.IReservationService, CSW306.Application.Services.ReservationService>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IServices.IPaymentService, CSW306.Application.Services.PaymentService>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IServices.IDiscountService, CSW306.Application.Services.DiscountService>();


builder.Services.AddDbContext<CSW306_ProjectAPIContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBConnection")));

//Load JWT setting
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = jwtSettings["SecretKey"];
var issuer = jwtSettings["Issuer"];
var audience = jwtSettings["Audience"];
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
 .AddJwtBearer(options =>
 {
     options.TokenValidationParameters = new TokenValidationParameters
     {
         ValidateIssuer = true,
         ValidateAudience = true,
         ValidateLifetime = true,
         ValidateIssuerSigningKey = true,
         ValidIssuer = issuer,
         ValidAudience = audience,
         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
     };
 });
builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
