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
    public class CarBrandsController : ControllerBase
    {
        private readonly RentalContext _context;

        public CarBrandsController(RentalContext context)
        {
            _context = context;
        }

        // GET: api/CarBrands
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CarBrand>>> GetCarBrands()
        {
            return await _context.CarBrands.ToListAsync();
        }

        // GET: api/CarBrands/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CarBrand>> GetCarBrand(int id)
        {
            var carBrand = await _context.CarBrands.FindAsync(id);

            if (carBrand == null)
            {
                return NotFound();
            }

            return carBrand;
        }

        // PUT: api/CarBrands/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCarBrand(int id, CarBrand carBrand)
        {
            if (id != carBrand.Id)
            {
                return BadRequest();
            }

            _context.Entry(carBrand).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CarBrandExists(id))
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

        // POST: api/CarBrands
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CarBrand>> PostCarBrand(CarBrand carBrand)
        {
            _context.CarBrands.Add(carBrand);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCarBrand", new { id = carBrand.Id }, carBrand);
        }

        // DELETE: api/CarBrands/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCarBrand(int id)
        {
            var carBrand = await _context.CarBrands.FindAsync(id);
            if (carBrand == null)
            {
                return NotFound();
            }

            _context.CarBrands.Remove(carBrand);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CarBrandExists(int id)
        {
            return _context.CarBrands.Any(e => e.Id == id);
        }
    }
}
