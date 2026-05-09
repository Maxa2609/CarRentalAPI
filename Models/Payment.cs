using System.ComponentModel.DataAnnotations;

namespace CarRentalAPI.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }

        public DateTime PaymentDate { get; set; } = DateTime.Now;
        public decimal Amount { get; set; }

        public int RentalOrderId { get; set; }
        public virtual RentalOrder RentalOrder { get; set; }
    }
}