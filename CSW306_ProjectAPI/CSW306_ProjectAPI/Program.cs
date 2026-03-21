using CSW306.Infrastructure.Data;
using CSW306.Presentation.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;
using System.Text;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped<CSW306.Application.Interfaces.IUnitOfWork, CSW306.Infrastructure.Repositories.UnitOfWork>();

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// SignalR
builder.Services.AddSignalR();

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        });
// Repository
builder.Services.AddScoped<CSW306.Application.Interfaces.IRepositories.ICategoryRepository, CSW306.Infrastructure.Repositories.CategoryRepository>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IRepositories.IItemRepository, CSW306.Infrastructure.Repositories.ItemRepository>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IRepositories.ITableRepository, CSW306.Infrastructure.Repositories.TableRepository>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IRepositories.IUserRepository, CSW306.Infrastructure.Repositories.UserRepository>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IRepositories.IReservationRepository, CSW306.Infrastructure.Repositories.ReservationRepository>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IRepositories.IPaymentRepository, CSW306.Infrastructure.Repositories.PaymentRepository>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IRepositories.IDiscountRepository, CSW306.Infrastructure.Repositories.DiscountRepository>();

// Services
builder.Services.AddScoped<CSW306.Application.Interfaces.IServices.ICategoryService, CSW306.Infrastructure.Services.CategoryService>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IServices.IItemService, CSW306.Infrastructure.Services.ItemService>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IServices.IOrderService, CSW306.Infrastructure.Services.OrderService>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IServices.IAuthService, CSW306.Infrastructure.Services.AuthService>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IServices.ITableService, CSW306.Infrastructure.Services.TableService>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IServices.IReservationService, CSW306.Infrastructure.Services.ReservationService>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IServices.IPaymentService, CSW306.Infrastructure.Services.PaymentService>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IServices.IDiscountService, CSW306.Infrastructure.Services.DiscountService>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IServices.IUserService, CSW306.Infrastructure.Services.UserService>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IPhotoService, CSW306.Infrastructure.Services.CloudinaryPhotoService>();

builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
    ConnectionMultiplexer.Connect(builder.Configuration.GetConnectionString("RedisCache") ?? "localhost:6379,abortConnect=false"));

builder.Services.AddSingleton<CSW306.Application.Interfaces.IServices.IRedisCacheService, CSW306.Infrastructure.Services.RedisCacheService>();

// AuditLogService retained as no-op
builder.Services.AddSingleton<CSW306.Infrastructure.Services.AuditLogService>();
builder.Services.AddSingleton<CSW306.Application.Interfaces.IServices.IAuditLogService>(sp =>
    sp.GetRequiredService<CSW306.Infrastructure.Services.AuditLogService>());

// Register ActivityLogService
builder.Services.AddScoped<CSW306.Application.Interfaces.IServices.IActivityLogService, CSW306.Infrastructure.Services.ActivityLogService>();

builder.Services.AddDbContext<CSW306_ProjectAPIContext>((sp, options) =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DBConnection"));
    // register interceptor
    var interceptor = sp.GetService<AuditSaveChangesInterceptor>();
    if (interceptor != null)
    {
        options.AddInterceptors(interceptor);
    }
});

// register interceptor as singleton
builder.Services.AddSingleton<AuditSaveChangesInterceptor>();

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

// Add CORS
var allowedDomains = new[]{
    "http://localhost:3000",
    "https://point-of-sale-system-vert.vercel.app"
};

builder.Services.AddCors(options =>{
    options.AddPolicy("AllowDomains", builder =>
        {
            builder.WithOrigins(allowedDomains)
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
        });
});

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

app.UseCors("AllowDomains");

app.UseAuthentication();

app.UseAuthorization();

app.MapHub<PosHub>("/hubs/pos");

app.MapControllers();

app.Run();
