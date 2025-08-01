using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CSW306_ProjectAPI.Models
{
    [Table("Reservation")]
    public class Reservation
    {
        [Key]
        [Required]
        public int ReservationId { get; set; }

        [Required]
        public int TableId { get; set; }

        [Required]
        public int NumberOfPeople { get; set; }

        [Required]
        [StringLength(500)]
        public string Note { get; set; }

        [Required]
        public DateTime Time { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [StringLength(100)]
        public string CustomerName { get; set; }
    }
}
