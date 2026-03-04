namespace CSW306.Application.Services;

using CSW306.Application.Interfaces.IServices;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

public class RedisCacheService : IRedisCacheService
{
    private readonly IDatabase _database;

    public RedisCacheService(IConnectionMultiplexer redis)
    {
        _database = redis.GetDatabase();
    }

    public async Task<T?> GetAsync<T>(string key)
    {
        var value = await _database.StringGetAsync(key);
        if (value.IsNullOrEmpty)
            return default;
        return JsonSerializer.Deserialize<T>(value!);
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null)
    {
        var json = JsonSerializer.Serialize(value);
        if(expiry.HasValue)
            await _database.StringSetAsync(key, json, expiry.Value);
        else    
            await _database.StringSetAsync(key, json);
    }

    public async Task RemoveAsync(string key)
    {
        await _database.KeyDeleteAsync(key);
    }

    // For Write-Back Inventory
    public async Task<long> DecrementAsync(string key, long value)
    {
        return await _database.StringDecrementAsync(key, value);
    }

    public async Task SetAddAsync(string key, string value)
    {
        await _database.SetAddAsync(key, value);
    }

    public async Task<IEnumerable<string>> SetMembersAsync(string key)
    {
        var members = await _database.SetMembersAsync(key);
        return members.ToStringArray();
    }

    public async Task SetRemoveAsync(string key, string value)
    {
        await _database.SetRemoveAsync(key, value);
    }
}