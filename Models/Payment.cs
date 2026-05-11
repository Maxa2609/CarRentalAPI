using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarRentalAPI.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }

        public DateTime PaymentDate { get; set; } = DateTime.Now;
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Amount { get; set; }

        public int RentalOrderId { get; set; }
        public virtual RentalOrder? RentalOrder { get; set; }
    }
}