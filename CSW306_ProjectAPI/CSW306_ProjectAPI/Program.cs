using CSW306.Application.Interfaces.IExternal;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Services;
using CSW306.Infrastructure.Data;
using CSW306.Infrastructure.Services;
using CSW306.Presentation.Hubs;
using CSW306.Presentation.Services;
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
builder.Services.AddScoped<CSW306.Application.Interfaces.IRepositories.IActivityLogRepository, CSW306.Infrastructure.Repositories.ActivityLogRepository>();
builder.Services.AddScoped<CSW306.Application.Interfaces.IRepositories.ISalesReportRepository, CSW306.Infrastructure.Repositories.SalesReportRepository>();
// Services
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IItemService, ItemService>();
builder.Services.AddScoped<IOrderService, CSW306.Application.Services.OrderService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITableService, TableService>();
builder.Services.AddScoped<IReservationService, ReservationService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IDiscountService, DiscountService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPhotoService, CSW306.Infrastructure.Services.CloudinaryPhotoService>();
builder.Services.AddScoped<IActivityLogService, CSW306.Application.Services.ActivityLogService>();
builder.Services.AddScoped<ISaleReportService, SaleReportService>();
builder.Services.AddScoped<IPosSignalRService, PosSignalRService>();
builder.Services.AddScoped<ICurrentUserProvider, CurrentUserProvider>();

builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
    ConnectionMultiplexer.Connect(builder.Configuration.GetConnectionString("RedisCache") ?? "localhost:6379,abortConnect=false"));

builder.Services.AddSingleton<IRedisCacheService, RedisCacheService>();

// Add this to your Program.cs
builder.Services.AddHttpClient<IQrPaymentService, VietQrService>();

// AuditLogService retained as no-op
builder.Services.AddSingleton<AuditLogService>();
builder.Services.AddSingleton<IAuditLogService>(sp =>
    sp.GetRequiredService<AuditLogService>());

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
builder.Services.AddHttpContextAccessor();

// Add CORS
var allowedDomains = new[]{
    "http://localhost:3000",
    "http://localhost:3002",
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
