using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace CSW306.Application.Utils
{
    public static class AuditLogHelper
    {
        /// <summary>
        /// Serializes an object to JSON string for audit logging
        /// </summary>
        public static string SerializeToJson<T>(T? obj) where T : class
        {
            if (obj == null)
                return string.Empty;
            
            try
            {
                return JsonSerializer.Serialize(obj, new JsonSerializerOptions 
                { 
                    WriteIndented = false 
                });
            }
            catch
            {
                return string.Empty;
            }
        }

        /// <summary>
        /// Gets the differences between two objects as old and new values JSON
        /// </summary>
        public static (string oldValues, string newValues) GetDifferences<T>(T? oldObj, T? newObj) where T : class
        {
            var oldValues = SerializeToJson(oldObj);
            var newValues = SerializeToJson(newObj);
            return (oldValues, newValues);
        }

        /// <summary>
        /// Comparison helper for specific properties
        /// </summary>
        public static Dictionary<string, (object? OldValue, object? NewValue)> CompareProperties<T>(T oldObj, T newObj) where T : class
        {
            var differences = new Dictionary<string, (object?, object?)>();
            
            if (oldObj == null || newObj == null)
                return differences;

            var properties = typeof(T).GetProperties();
            foreach (var prop in properties)
            {
                try
                {
                    var oldValue = prop.GetValue(oldObj);
                    var newValue = prop.GetValue(newObj);

                    if (!Equals(oldValue, newValue))
                    {
                        differences[prop.Name] = (oldValue, newValue);
                    }
                }
                catch { }
            }

            return differences;
        }
    }
}
