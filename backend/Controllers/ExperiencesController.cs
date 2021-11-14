using System;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace prid_2122_g04.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExperiencesController : ControllerBase{

        private readonly MainContext _context;

        public ExperiencesController(MainContext context){
            this._context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Experience>>> GetAllTraining() {
            // Récupère une liste de tous les membres
            return await _context.Training.ToListAsync();
        }

        [HttpGet("{titre}")]
        public async Task<ActionResult<Experience>> GetOne(string training) {
            var train = await _context.Training.FindAsync(training);
            if (train == null)
                return NotFound();
            return train;
        }

        [HttpPost]
        public async Task<ActionResult<Experience>> PostMember(Training training) {
            _context.Training.Add(training);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOne), new { training = training.Title }, training);
        }

        [HttpPut]
        public async Task<IActionResult> PutMember(Training training) {
            var exists = await _context.Training.CountAsync(t => t.Title == training.Title) > 0;
            if (!exists)
                return NotFound();
           _context.Entry(training).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{titre}")]
        public async Task<IActionResult> DeleteMember(string titre) {
            var training = await _context.Training.FindAsync(titre);
            if (training == null)
                return NotFound();
            _context.Training.Remove(training);
            await _context.SaveChangesAsync();
            return NoContent();
        }




    }

}