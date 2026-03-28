using CSW306.Application.DTO;
using CSW306.Application.Interfaces.IExternal;
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

        public VietQrService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string> GeneratePaymentQrAsync(int orderId, decimal amount)
        {
            var requestPayload = new VietQrRequestDto
            {
                Amount = amount,
                AddInfo = $"Thanh toan don hang {orderId}"
            };

            var response = await _httpClient.PostAsJsonAsync("https://api.vietqr.io/v2/generate", requestPayload);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<VietQrResponseDto>(content);

                // Return the Base64 image string (e.g., "data:image/png;base64,iVBORw0KGgo...")
                if (result?.Data?.QrDataURL != null)
                {
                    return result.Data.QrDataURL;
                }
            }

            // Fallback if the API fails
            throw new Exception("Failed to generate VietQR code.");
        }
    }
}
