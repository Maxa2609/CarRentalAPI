using System.ComponentModel.DataAnnotations;

namespace CarRentalAPI.Models
{
    public class CarBrand
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Назва марки обов'язкова")]
        public string Name { get; set; }

        public virtual ICollection<Car> Cars { get; set; } = new List<Car>();
    }
}