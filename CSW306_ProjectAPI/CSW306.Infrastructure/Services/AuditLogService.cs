using CSW306.Application.Interfaces.IServices;
using CSW306.Domain.Entities;
using System.Collections.Concurrent;

namespace CSW306.Infrastructure.Services
{
    public class AuditLogService : IAuditLogService
    {
        private readonly ConcurrentQueue<AuditLog> _logQueue = new();

        public void EnqueueLog(string action, string entityName, int? entityId, int? userId, string? details)
        {
            _logQueue.Enqueue(new AuditLog
            {
                Action = action,
                EntityName = entityName,
                EntityId = entityId,
                UserId = userId,
                Details = details,
                Timestamp = DateTime.UtcNow
            });
        }

        public List<AuditLog> DequeueAll()
        {
            var logs = new List<AuditLog>();
            while (_logQueue.TryDequeue(out var log))
            {
                logs.Add(log);
            }
            return logs;
        }
    }
}
