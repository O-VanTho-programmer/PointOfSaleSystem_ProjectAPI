using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSW306.Domain.Entities
{
    public class ActivityLog
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ActivityId { get; set; }
        [Required]
        [StringLength(50)]
        public string Action { get; set; }     
        [Required]
        [StringLength(100)]
        public string EntityName { get; set; }
        public int? EntityId { get; set; }
        public int? UserId { get; set; }
        [StringLength(500)]
        public string? Details { get; set; }
        public DateTimeOffset Timestamp { get; set; }
    }
}
