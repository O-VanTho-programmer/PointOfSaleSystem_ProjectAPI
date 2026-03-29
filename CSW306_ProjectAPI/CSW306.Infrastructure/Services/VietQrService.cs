using CSW306.Application.DTO;
using CSW306.Application.Interfaces.IExternal;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace CSW306.Infrastructure.Services
{
    public class VietQrService : IQrPaymentService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<VietQrService> _logger;
        public VietQrService(HttpClient httpClient, ILogger<VietQrService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<string> GeneratePaymentQrAsync(int orderId, decimal amount)
        {
            var requestPayload = new VietQrRequestDto
            {
                Amount = amount,
                AddInfo = $"Thanh toan don hang {orderId}"
            };

            var response = await _httpClient.PostAsJsonAsync("https://api.vietqr.io/v2/generate", requestPayload);
            var content = await response.Content.ReadAsStringAsync();

            // 1. Log the raw JSON so you can see it in your terminal
            _logger.LogWarning("========== VIETQR RAW RESPONSE ==========\n{Content}\n=========================================", content); if (response.IsSuccessStatusCode)
            {
                var result = JsonSerializer.Deserialize<VietQrResponseDto>(content);

                if (result != null && result.Code == "00" && result.Data?.QrDataURL != null)
                {
                    return result.Data.QrDataURL;
                }
                else
                {
                   _logger.LogError("VietQR API rejected the request. Code: {Code}, Desc: {Desc}", result?.Code, result?.Desc);
                   throw new Exception($"VietQR Error: {result?.Desc}. Code: {result?.Code}");
                }
            }

            throw new Exception("Failed to generate VietQR code.");
        }
    }
}
