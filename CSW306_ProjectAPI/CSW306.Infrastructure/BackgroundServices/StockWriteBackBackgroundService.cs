using CSW306.Application.Interfaces;
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
    public class StockWriteBackBackgroundService: BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<StockWriteBackBackgroundService> _logger;

        public StockWriteBackBackgroundService(IServiceProvider serviceProvider, ILogger<StockWriteBackBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Stock Write-Back Service started.");
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessPendingStockUpdatesAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred processing stock updates.");
                }
                // Wait 10 seconds before running again
                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
            }
        }
        private async Task ProcessPendingStockUpdatesAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
            var redis = scope.ServiceProvider.GetRequiredService<IRedisCacheService>();

            var pendingStockUpdates = await redis.SetMembersAsync("PendingStockUpdate");

            if(pendingStockUpdates == null || !pendingStockUpdates.Any())
            {
                return;
            }

            var updatedItems = new List<CSW306.Domain.Entities.Items>();

            foreach( var itemIdStr in pendingStockUpdates)
            {
                int itemId = int.Parse(itemIdStr);
                var newStocks = await redis.GetAsync<int>("item:stock:" + itemId);
                var item = await unitOfWork.Items.GetByIdAsync(itemId);

                if (item != null)
                {
                    item.QuantityInStock = newStocks;
                    updatedItems.Add(item);
                    await redis.SetRemoveAsync("PendingStockUpdate", itemIdStr);
                }
            }

            if (updatedItems.Any()) 
            {
                await unitOfWork.Items.UpdateRangeAsync(updatedItems);
                await unitOfWork.SaveChangesAsync();
            }
        }

    }
}
