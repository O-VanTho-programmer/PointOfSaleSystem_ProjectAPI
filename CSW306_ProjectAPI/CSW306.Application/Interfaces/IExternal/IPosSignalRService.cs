using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IExternal
{
    public interface IPosSignalRService
    {
        Task NotifiReadyOrderAsync(int orderId, int userId);
        Task NotifyPaymentSuccessAsync(int orderId);
        Task NotifyPaymentUnderPaidAsync(int orderId, decimal amountPaid, decimal expectedAmount);
    }
}
