using System.ComponentModel.DataAnnotations;

namespace CarRentalAPI.Models
{
    public class RentalOrder
    {
        [Key]
        public int Id { get; set; }

        public DateTime RentStartDate { get; set; }
        public DateTime RentEndDate { get; set; }

        public decimal TotalAmount { get; set; }

        public int CarId { get; set; }
        public virtual Car Car { get; set; }

        public int CustomerId { get; set; }
        public virtual Customer Customer { get; set; }

        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}