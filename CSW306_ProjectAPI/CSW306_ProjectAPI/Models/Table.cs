using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CSW306_ProjectAPI.Models
{
    [Table("Table")]
    public class Table
    {
        [Key]
        [Required]
        public int TableId { get; set; }

        [Range(1, int.MaxValue,ErrorMessage= "table cap >0")]
        public int Capacity { get; set; }

        [Required]
        [StringLength(100)]
        public string Status { get; set; }

        public ICollection<Reservation> Reservation { get; set; }

    }
}
