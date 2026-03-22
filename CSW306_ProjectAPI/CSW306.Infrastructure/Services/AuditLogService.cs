using CSW306.Application.Interfaces.IServices;

namespace CSW306.Infrastructure.Services
{
    // No-op audit log service retained for compatibility with DI registrations in Program.cs
    public class AuditLogService : IAuditLogService
    {
        public void EnqueueLog(string action, string entityName, int? entityId, int? userId, string? oldValues = null, string? newValues = null, string? details = null)
        {
            // Intentionally empty — auditing is performed by the AuditSaveChangesInterceptor via EF Core.
        }
    }
}
