using CSW306.Application.DTO.Upload;
using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IRepositories;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CSW306.Application.Services
{
    public class ActivityLogService : IActivityLogService
    {
        private readonly IActivityLogRepository _activityLogRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ActivityLogService(IActivityLogRepository activityLogRepository, IUnitOfWork unitOfWork)
        {
            _activityLogRepository = activityLogRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<TemplateApi<ActivityLog>> GetAllActivitiesAsync(int pageNumber, int pageSize, DateTime? startDate, DateTime? endDate, string? entityName)
        {
            try
            {
                if (!startDate.HasValue && !endDate.HasValue)
                {
                    var today = DateTime.UtcNow.Date;
                    startDate = today;
                    endDate = today;
                }

                if (endDate.HasValue)
                {
                    endDate = endDate.Value.Date.AddDays(1).AddTicks(-1);
                }

                if (startDate.HasValue && startDate.Value.Kind == DateTimeKind.Unspecified)
                {
                    startDate = DateTime.SpecifyKind(startDate.Value, DateTimeKind.Utc);
                }

                if (endDate.HasValue && endDate.Value.Kind == DateTimeKind.Unspecified)
                {
                    endDate = DateTime.SpecifyKind(endDate.Value, DateTimeKind.Utc);
                }

                var s = startDate ?? DateTime.MinValue;
                var e = endDate ?? DateTime.MaxValue;

                var listForCount = await _activityLogRepository.GetActivitiesByDateRangeAsync(s, e);
                int countRecord = listForCount.Count();

                var activities = await _activityLogRepository.GetActivitiesAsync(s, e, entityName, pageNumber, pageSize);

                return new Pagination().HandlePagedRespond(pageNumber, pageSize, activities, countRecord);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<ActivityLog>(null, null, "An unexpected error occurred while fetching activity logs.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<ActivityLog>?> GetActivityByIdAsync(int activityId)
        {
            try
            {
                var activity = await _activityLogRepository.GetByIdAsync(activityId);
                return new Pagination().HandleGetByIdRespond(activity);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<ActivityLog>(null, null, "An unexpected error occurred while fetching the activity log.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<ActivityLog>> GetActivitiesByUserIdAsync(int userId)
        {
            try
            {
                var activities = await _activityLogRepository.GetActivitiesByUserIdAsync(userId);
                var countRecord = activities.Count();
                return new Pagination().HandleGetAllRespond(1, countRecord, activities, countRecord);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<ActivityLog>(null, null, "An unexpected error occurred while fetching activity logs by user.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<ActivityLog>> GetActivitiesByEntityAsync(string entityName)
        {
            try
            {
                var activities = await _activityLogRepository.GetActivitiesByEntityAsync(entityName);
                var countRecord = activities.Count();
                return new Pagination().HandleGetAllRespond(1, countRecord, activities, countRecord);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<ActivityLog>(null, null, "An unexpected error occurred while fetching activity logs by entity.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<ActivityLog>> LogActivity(ActivityLogUploadDTO dto)
        {
            try
            {
                var newActivityLog = new ActivityLog
                {
                    Action = dto.Action,
                    Details = dto.Details,
                    EntityId = dto.EntityId,
                    EntityName = dto.EntityName,
                    UserId = dto.UserId,
                    Timestamp = DateTimeOffset.UtcNow
                };

                await _activityLogRepository.AddAsync(newActivityLog);
                await _unitOfWork.SaveChangesAsync();

                return new Pagination().HandleGetByIdRespond(newActivityLog);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<ActivityLog>(null, null, "An unexpected error occurred while creating the activity log on the server.", false, 0, 0, 0, 0);
            }
        }
    }
}
