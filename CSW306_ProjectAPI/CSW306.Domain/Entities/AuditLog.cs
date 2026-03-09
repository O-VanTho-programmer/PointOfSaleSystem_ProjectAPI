using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CSW306.Domain.Entities
{
    public class AuditLog
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int LogId { get; set; }

        [Required]
        [StringLength(50)]
        public string Action { get; set; }        // e.g. "CreateOrder", "UpdateItem", "Login"

        [Required]
        [StringLength(100)]
        public string EntityName { get; set; }     // e.g. "Orders", "Items", "Users"

        public int? EntityId { get; set; }         // ID of the affected record

        public int? UserId { get; set; }           // Who performed the action

        [StringLength(500)]
        public string? Details { get; set; }       // Extra context (JSON or text)

        [Required]
        public DateTime Timestamp { get; set; }
    }
}
