using CSW306.Application.Interfaces.IServices;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSW306.Infrastructure.BackgroundServices
{
    public class OrderCleanupSweeper : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<OrderCleanupSweeper> _logger;

        public OrderCleanupSweeper(IServiceScopeFactory scopeFactory, ILogger<OrderCleanupSweeper> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Background Orders Sweeper is starting");

            while (!stoppingToken.IsCancellationRequested) {
                try
                {
                    await CleanupAbandonedOrdersAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred while sweeping abandoned orders.");
                } finally {
                    await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
                }
            }
        }

        private async Task CleanupAbandonedOrdersAsync()
        {
            using var scope = _scopeFactory.CreateScope();
            var orderServices = scope.ServiceProvider.GetRequiredService<IOrderService>();

            await orderServices.CancelAbandonedTakeawayOrdersAsync();

            _logger.LogInformation("Sweeper successfully checked and cleaned abandoned orders.");
        }
    }
}
