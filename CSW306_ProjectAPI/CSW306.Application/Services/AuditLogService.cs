using CSW306.Application.Interfaces.IServices;

namespace CSW306.Application.Services
{
    public class AuditLogService : IAuditLogService
    {
        public void EnqueueLog(string action, string entityName, int? entityId, int? userId, string? oldValues = null, string? newValues = null, string? details = null)
        {
        }
    }
}
