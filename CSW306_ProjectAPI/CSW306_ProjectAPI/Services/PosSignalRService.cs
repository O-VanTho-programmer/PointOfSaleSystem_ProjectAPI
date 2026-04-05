using CSW306.Application.Interfaces.IExternal;
using CSW306.Presentation.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace CSW306.Presentation.Services
{
    public class PosSignalRService : IPosSignalRService
    {
        private readonly IHubContext<PosHub> _hubContext;
        public PosSignalRService(IHubContext<PosHub> hubContext) {
            _hubContext = hubContext;
        }
        public async Task NotifyPaymentSuccessAsync(int orderId)
        {
            await _hubContext.Clients.All.SendAsync("PaymentReceived", orderId);
        }

        public async Task NotifyPaymentUnderPaidAsync(int orderId, decimal amountPaid, decimal expectedAmount)
        {
            await _hubContext.Clients.All.SendAsync("PaymentUnderPaid", orderId, amountPaid, expectedAmount);
        }
    }
}
