using CSW306.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace CSW306.Application.DTO.Upload
{
    public class UpdatePaymentStatusDTO
    {
        [Required]
        public PaymentStatus PaymentStatus { get; set; }
    }
}
