namespace CSW306.Infrastructure.Services;

using CSW306.Application.Interfaces.IServices;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

public class RedisCacheService : IRedisCacheService
{
    private readonly IDatabase _database;
    private readonly ILogger<RedisCacheService> _logger;

    public RedisCacheService(IConnectionMultiplexer redis, ILogger<RedisCacheService> logger)
    {
        _database = redis.GetDatabase();
        _logger = logger;
    }

    public async Task<T?> GetAsync<T>(string key)
    {
        try
        {
            var value = await _database.StringGetAsync(key);
            if (value.IsNullOrEmpty)
                return default;
            return JsonSerializer.Deserialize<T>(value!);
        }
        catch (RedisException ex)
        {
            _logger.LogWarning(ex, "Redis is down or unreachable. Skipping cache check for key: {Key}", key);
            return default;
        }
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null)
    {
        try
        {
            var json = JsonSerializer.Serialize(value);
            if(expiry.HasValue)
                await _database.StringSetAsync(key, json, expiry.Value);
            else    
                await _database.StringSetAsync(key, json);
        }
        catch (RedisException ex)
        {
            _logger.LogWarning(ex, "Redis cache write failed. Ignoring cache update for key: {Key}", key);
        }
    }

    public async Task RemoveAsync(string key)
    {
        try
        {
            await _database.KeyDeleteAsync(key);
        }
        catch (RedisException ex)
        {
            _logger.LogWarning(ex, "Redis KeyDelete failed for key: {Key}", key);
        }
    }

    // For Write-Back Inventory
    public async Task<long> DecrementAsync(string key, long value)
    {
        try
        {
            return await _database.StringDecrementAsync(key, value);
        }
        catch (RedisException ex)
        {
            _logger.LogWarning(ex, "Redis Decrement failed for key: {Key}. Redis is down.", key);
            throw; // We let the caller handle this so it can fall back to SQL
        }
    }

    public async Task SetAddAsync(string key, string value)
    {
        try
        {
            await _database.SetAddAsync(key, value);
        }
        catch (RedisException ex)
        {
            _logger.LogWarning(ex, "Redis SetAdd failed for key: {Key}", key);
            throw;
        }
    }

    public async Task<IEnumerable<string>> SetMembersAsync(string key)
    {
        try
        {
            var members = await _database.SetMembersAsync(key);
            return members.ToStringArray();
        }
        catch (RedisException ex)
        {
            _logger.LogWarning(ex, "Redis SetMembers failed for key: {Key}", key);
            return Array.Empty<string>();
        }
    }

    public async Task SetRemoveAsync(string key, string value)
    {
        try
        {
            await _database.SetRemoveAsync(key, value);
        }
        catch (RedisException ex)
        {
            _logger.LogWarning(ex, "Redis SetRemove failed for key: {Key}", key);
        }
    }
}