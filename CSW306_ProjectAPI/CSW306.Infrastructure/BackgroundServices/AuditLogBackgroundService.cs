using CSW306.Infrastructure.Services;
using CSW306.Infrastructure.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace CSW306.Infrastructure.BackgroundServices
{
    public class AuditLogBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly AuditLogService _auditLogService;
        private readonly ILogger<AuditLogBackgroundService> _logger;

        public AuditLogBackgroundService(
            IServiceProvider serviceProvider,
            AuditLogService auditLogService,
            ILogger<AuditLogBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _auditLogService = auditLogService;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Audit Log Background Service started.");
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var logs = _auditLogService.DequeueAll();
                    if (logs.Any())
                    {
                        using var scope = _serviceProvider.CreateScope();
                        var context = scope.ServiceProvider.GetRequiredService<CSW306_ProjectAPIContext>();

                        await context.AuditLogs.AddRangeAsync(logs, stoppingToken);
                        await context.SaveChangesAsync(stoppingToken);

                        _logger.LogInformation("Flushed {Count} audit log(s) to database.", logs.Count);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error flushing audit logs to database.");
                }

                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
        }
    }
}
