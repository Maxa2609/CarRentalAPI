using Microsoft.EntityFrameworkCore;

namespace CarRentalAPI.Models
{
    public class RentalContext : DbContext
    {
        public virtual DbSet<CarBrand> CarBrands { get; set; }
        public virtual DbSet<CarClass> CarClasses { get; set; }
        public virtual DbSet<Car> Cars { get; set; }
        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<RentalOrder> RentalOrders { get; set; }
        public virtual DbSet<Payment> Payments { get; set; }

        public RentalContext(DbContextOptions<RentalContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }
    }
}