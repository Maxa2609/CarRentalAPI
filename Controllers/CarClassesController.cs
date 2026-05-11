using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarRentalAPI.Models;

namespace CarRentalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarClassesController : ControllerBase
    {
        private readonly RentalContext _context;

        public CarClassesController(RentalContext context)
        {
            _context = context;
        }

        // GET: api/CarClasses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CarClass>>> GetCarClasses()
        {
            return await _context.CarClasses.ToListAsync();
        }

        // GET: api/CarClasses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CarClass>> GetCarClass(int id)
        {
            var carClass = await _context.CarClasses.FindAsync(id);

            if (carClass == null)
            {
                return NotFound();
            }

            return carClass;
        }

        // PUT: api/CarClasses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCarClass(int id, CarClass carClass)
        {
            if (id != carClass.Id)
            {
                return BadRequest();
            }

            _context.Entry(carClass).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CarClassExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/CarClasses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CarClass>> PostCarClass(CarClass carClass)
        {
            _context.CarClasses.Add(carClass);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCarClass", new { id = carClass.Id }, carClass);
        }

        // DELETE: api/CarClasses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCarClass(int id)
        {
            var carClass = await _context.CarClasses.FindAsync(id);
            if (carClass == null)
            {
                return NotFound();
            }

            _context.CarClasses.Remove(carClass);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CarClassExists(int id)
        {
            return _context.CarClasses.Any(e => e.Id == id);
        }
    }
}
