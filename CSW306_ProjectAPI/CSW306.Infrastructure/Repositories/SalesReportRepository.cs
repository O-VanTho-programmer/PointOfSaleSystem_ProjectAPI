using CSW306.Application.DTO.Response;
using CSW306.Application.Interfaces.IRepositories;
using CSW306.Domain.Entities;
using CSW306.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;

namespace CSW306.Infrastructure.Repositories
{
    public class SalesReportRepository : ISalesReportRepository
    {
        private readonly CSW306_ProjectAPIContext _context;
        public SalesReportRepository(CSW306_ProjectAPIContext context)
        {
            _context = context;
        }

        public async Task<SalesMetricsDto> GetMetricsAsync(DateTime startDate, DateTime endDate)
        {
            var currentOrders = await _context.Orders
                .Include(o => o.OrderItems)
                .Where(o => (o.Status == OrderStatus.Completed || o.PaymentStatus == PaymentStatus.Paid) 
                         && o.CreatedDate >= startDate 
                         && o.CreatedDate <= endDate)
                .ToListAsync();

            var currentRevenue = currentOrders.SelectMany(o => o.OrderItems).Sum(oi => oi.Quantity * oi.PriceAtOrder);
            var currentOrderCount = currentOrders.Count;
            var currentItemsSold = currentOrders.SelectMany(o => o.OrderItems).Sum(oi => oi.Quantity);
            var currentAov = currentOrderCount > 0 ? currentRevenue / currentOrderCount : 0;

            // Trend calculation
            var periodDuration = endDate - startDate;
            var prevStartDate = startDate.Subtract(periodDuration);
            var prevEndDate = startDate;

            var prevOrders = await _context.Orders
                .Include(o => o.OrderItems)
                .Where(o => (o.Status == OrderStatus.Completed || o.PaymentStatus == PaymentStatus.Paid) 
                         && o.CreatedDate >= prevStartDate 
                         && o.CreatedDate < prevEndDate)
                .ToListAsync();

            var prevRevenue = prevOrders.SelectMany(o => o.OrderItems).Sum(oi => oi.Quantity * oi.PriceAtOrder);
            var prevOrderCount = prevOrders.Count;
            var prevItemsSold = prevOrders.SelectMany(o => o.OrderItems).Sum(oi => oi.Quantity);
            var prevAov = prevOrderCount > 0 ? prevRevenue / prevOrderCount : 0;

            return new SalesMetricsDto
            {
                TotalRevenue = currentRevenue,
                RevenueTrend = CalculateTrend(currentRevenue, prevRevenue),
                TotalOrders = currentOrderCount,
                OrdersTrend = CalculateTrend(currentOrderCount, prevOrderCount),
                AverageOrderValue = currentAov,
                AovTrend = CalculateTrend(currentAov, prevAov),
                ItemsSold = currentItemsSold,
                ItemsSoldTrend = CalculateTrend(currentItemsSold, prevItemsSold)
            };
        }

        public async Task<List<ChartDataPointDto>> GetOrdersByHourAsync(DateTime startDate, DateTime endDate)
        {
            var grouped = await _context.Orders
                .Where(o => (o.Status == OrderStatus.Completed || o.PaymentStatus == PaymentStatus.Paid) 
                         && o.CreatedDate >= startDate 
                         && o.CreatedDate <= endDate)
                .GroupBy(o => o.CreatedDate.Hour)
                .Select(g => new { Hour = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Hour, x => x.Count);

            var result = new List<ChartDataPointDto>();
            for (int i = 8; i <= 22; i++)
            {
                result.Add(new ChartDataPointDto
                {
                    Label = $"{i:00}:00",
                    NumberOfOrder = grouped.ContainsKey(i) ? grouped[i] : 0
                });
            }

            return result;
        }

        public async Task<List<TopSellerDto>> GetTopSellersAsync(DateTime startDate, DateTime endDate, int limit = 5)
        {
            var topItems = await _context.OrderItems
                .Include(oi => oi.Order)
                .Include(oi => oi.Item)
                .Where(oi => (oi.Order.Status == OrderStatus.Completed || oi.Order.PaymentStatus == PaymentStatus.Paid)
                          && oi.Order.CreatedDate >= startDate 
                          && oi.Order.CreatedDate <= endDate)
                .GroupBy(oi => new { oi.ItemId, oi.Item.Name })
                .Select(g => new
                {
                    ItemName = g.Key.Name,
                    QuantitySold = g.Sum(oi => oi.Quantity),
                    TotalRevenue = g.Sum(oi => oi.Quantity * oi.PriceAtOrder)
                })
                .OrderByDescending(x => x.QuantitySold)
                .Take(limit)
                .ToListAsync();

            var result = new List<TopSellerDto>();
            int rank = 1;
            foreach (var item in topItems)
            {
                result.Add(new TopSellerDto
                {
                    Rank = rank++,
                    ItemName = item.ItemName,
                    QuantitySold = item.QuantitySold,
                    TotalRevenue = item.TotalRevenue
                });
            }

            return result;
        }

        private decimal CalculateTrend(decimal current, decimal previous)
        {
            if (previous == 0) return current > 0 ? 100 : 0;
            return Math.Round(((current - previous) / previous) * 100, 1);
        }
    }
}
