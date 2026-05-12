using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarRentalAPI.Models;

namespace CarRentalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarsController : ControllerBase
    {
        private readonly RentalContext _context;

        public CarsController(RentalContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Car>>> GetCars()
        {
            var cars = await _context.Cars
                .Include(c => c.Brand)
                .Include(c => c.CarClass)
                .ToListAsync();

            return Ok(cars);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Car>> GetCar(int id)
        {
            var car = await _context.Cars
                .Include(c => c.Brand)
                .Include(c => c.CarClass)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (car == null)
            {
                return NotFound();
            }

            return Ok(car);
        }


        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Car>>> SearchCars(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return await GetCars();
            }

            var lowerQuery = query.ToLower();


            var filteredCars = await _context.Cars
                .Include(c => c.Brand)
                .Include(c => c.CarClass)
                .Where(c => c.Model.ToLower().Contains(lowerQuery) ||
                            (c.Brand != null && c.Brand.Name.ToLower().Contains(lowerQuery)))
                .ToListAsync();

            return Ok(filteredCars);
        }


        [HttpPost]
        public async Task<ActionResult<Car>> PostCar(Car car)
        {
            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

  
            var newCar = await _context.Cars
                .Include(c => c.Brand)
                .Include(c => c.CarClass)
                .FirstOrDefaultAsync(c => c.Id == car.Id);

            return CreatedAtAction("GetCar", new { id = car.Id }, newCar);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null)
            {
                return NotFound();
            }

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}