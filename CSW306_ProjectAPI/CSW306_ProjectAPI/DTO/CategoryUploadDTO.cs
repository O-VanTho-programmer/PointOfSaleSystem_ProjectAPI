using System.ComponentModel.DataAnnotations;

namespace CSW306_ProjectAPI.DTO
{
    public class CategoryUploadDTO
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        public string? Description { get; set; }
    }
}