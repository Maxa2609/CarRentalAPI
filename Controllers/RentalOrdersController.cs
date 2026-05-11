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
    public class RentalOrdersController : ControllerBase
    {
        private readonly RentalContext _context;

        public RentalOrdersController(RentalContext context)
        {
            _context = context;
        }

        // GET: api/RentalOrders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RentalOrder>>> GetRentalOrders()
        {
            return await _context.RentalOrders.ToListAsync();
        }

        // GET: api/RentalOrders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RentalOrder>> GetRentalOrder(int id)
        {
            var rentalOrder = await _context.RentalOrders.FindAsync(id);

            if (rentalOrder == null)
            {
                return NotFound();
            }

            return rentalOrder;
        }

        // PUT: api/RentalOrders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRentalOrder(int id, RentalOrder rentalOrder)
        {
            if (id != rentalOrder.Id)
            {
                return BadRequest();
            }

            _context.Entry(rentalOrder).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RentalOrderExists(id))
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

        // POST: api/RentalOrders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RentalOrder>> PostRentalOrder(RentalOrder rentalOrder)
        {
            _context.RentalOrders.Add(rentalOrder);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRentalOrder", new { id = rentalOrder.Id }, rentalOrder);
        }

        // DELETE: api/RentalOrders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRentalOrder(int id)
        {
            var rentalOrder = await _context.RentalOrders.FindAsync(id);
            if (rentalOrder == null)
            {
                return NotFound();
            }

            _context.RentalOrders.Remove(rentalOrder);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RentalOrderExists(int id)
        {
            return _context.RentalOrders.Any(e => e.Id == id);
        }
    }
}
