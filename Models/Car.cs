using CarRentalAPI.Models;
using System.ComponentModel.DataAnnotations;

namespace CarRentalAPI.Models
{
    public class Car
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Model { get; set; }

        public int Year { get; set; }

        [Required]
        public string LicensePlate { get; set; }

        public int BrandId { get; set; }
        public virtual CarBrand? Brand { get; set; }

        public int ClassId { get; set; }
        public virtual CarClass? CarClass { get; set; }

        public virtual ICollection<RentalOrder> RentalOrders { get; set; } = new List<RentalOrder>();
    }
}