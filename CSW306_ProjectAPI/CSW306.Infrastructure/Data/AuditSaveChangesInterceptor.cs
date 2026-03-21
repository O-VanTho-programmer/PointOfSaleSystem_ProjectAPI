using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using CSW306.Domain.Entities;
using CSW306.Infrastructure.Data;

namespace CSW306.Infrastructure.Data
{
    public class AuditSaveChangesInterceptor : SaveChangesInterceptor
    {
        public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
        {
            AddAuditEntries(eventData.Context);
            return base.SavingChanges(eventData, result);
        }

        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
        {
            AddAuditEntries(eventData.Context);
            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        private void AddAuditEntries(DbContext? context)
        {
            if (context == null) return;

            var entries = context.ChangeTracker.Entries()
                .Where(e => e.Entity != null && !(e.Entity is AuditLog) && (e.State == EntityState.Added || e.State == EntityState.Modified || e.State == EntityState.Deleted))
                .ToList();

            if (!entries.Any()) return;

            var auditLogs = new List<AuditLog>();

            foreach (var entry in entries)
            {
                try
                {
                    var entityName = entry.Entity!.GetType().Name;

                    int? entityId = null;
                    // try to get single integer primary key
                    var key = entry.Metadata.FindPrimaryKey();
                    if (key != null && key.Properties.Count == 1)
                    {
                        var pkProp = key.Properties[0];
                        var pkCurrent = entry.Property(pkProp.Name).CurrentValue;
                        if (pkCurrent is int i) entityId = i;
                        else if (pkCurrent is long l) entityId = (int)l;
                    }

                    string? oldValues = null;
                    string? newValues = null;

                    if (entry.State == EntityState.Added)
                    {
                        newValues = SerializeValues(entry.CurrentValues);
                    }
                    else if (entry.State == EntityState.Deleted)
                    {
                        oldValues = SerializeValues(entry.OriginalValues);
                    }
                    else if (entry.State == EntityState.Modified)
                    {
                        oldValues = SerializeValues(entry.OriginalValues);
                        newValues = SerializeValues(entry.CurrentValues);
                    }

                    var action = entry.State.ToString();

                    auditLogs.Add(new AuditLog
                    {
                        Action = action,
                        EntityName = entityName,
                        EntityId = entityId,
                        UserId = null,
                        Details = string.Empty,
                        OldValues = string.IsNullOrEmpty(oldValues) ? null : oldValues,
                        NewValues = string.IsNullOrEmpty(newValues) ? null : newValues
                  
                    });
                }
                catch
                {
                    // swallow per-entry errors to avoid breaking save; optionally log if logger available
                }
            }

            if (auditLogs.Any())
            {
                // Add audit logs to the same DbContext so they're saved in same transaction
                context.Set<AuditLog>().AddRange(auditLogs);
            }
        }

        private string SerializeValues(PropertyValues values)
        {
            var dict = new Dictionary<string, object?>();
            foreach (var prop in values.Properties)
            {
                try
                {
                    var val = values[prop.Name];
                    dict[prop.Name] = val;
                }
                catch { }
            }

            try
            {
                return JsonSerializer.Serialize(dict);
            }
            catch
            {
                return string.Empty;
            }
        }
    }
}
