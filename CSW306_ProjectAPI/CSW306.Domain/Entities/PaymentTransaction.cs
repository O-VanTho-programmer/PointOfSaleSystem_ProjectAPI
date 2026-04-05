using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSW306.Domain.Entities
{
    public class PaymentTransaction
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PaymentTransactionId { get; set; }
        [Required]
        public string ReferenceCode { get; set; }
        [Required]
        public int OrderId { get; set; }
        [Required]
        public decimal Amount { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }
        [StringLength(255)]
        public string? Gateway { get; set; }
    }
}
