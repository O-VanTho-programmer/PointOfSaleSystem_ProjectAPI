namespace CSW306.Application.Interfaces.IServices
{
    public interface IAuditLogService
    {
        void EnqueueLog(string action, string entityName, int? entityId, int? userId, string? details);
    }
}
