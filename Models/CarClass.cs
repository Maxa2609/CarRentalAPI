using System.ComponentModel.DataAnnotations;

namespace CarRentalAPI.Models
{
    public class CarClass
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string ClassName { get; set; }

        public decimal BaseDailyRate { get; set; }

        public virtual ICollection<Car> Cars { get; set; } = new List<Car>();
    }
}