using CarRentalAPI.Models;
using System.ComponentModel.DataAnnotations;

namespace CarRentalAPI.Models
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public string DriverLicense { get; set; }

        public string Phone { get; set; }

        public virtual ICollection<RentalOrder> RentalOrders { get; set; } = new List<RentalOrder>();
    }
}