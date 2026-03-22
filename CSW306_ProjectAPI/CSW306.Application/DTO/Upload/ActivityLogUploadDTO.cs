using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSW306.Application.DTO.Upload
{
    public class ActivityLogUploadDTO
    {
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
    }
}
