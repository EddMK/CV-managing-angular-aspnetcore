using System;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using PRID_Framework;

namespace prid_2122_g04.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExperiencesController : ControllerBase{

        private readonly MainContext _context;
        private readonly IMapper _mapper;

        public ExperiencesController(MainContext context, IMapper mapper){
            this._context = context;
            this._mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExperienceDTO>>> GetAllTraining() {
            // Récupère une liste de tous les membres
            return _mapper.Map<List<ExperienceDTO>>(await _context.Training.ToListAsync());
        }

        [HttpGet("{titre}")]
        public async Task<ActionResult<ExperienceDTO>> GetOne(string training) {
            var train = await _context.Training.FindAsync(training);
            if (train == null)
                return NotFound();
            return _mapper.Map<ExperienceDTO>(train);
        }

        [HttpPost]
        public async Task<ActionResult<ExperienceDTO>> PostTraining(ExperienceDTO training) {
            var newTraining = _mapper.Map<Experience>(training);
            _context.Training.Add(newTraining);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty) return BadRequest(res);
            return CreatedAtAction(nameof(GetOne), new { training = training.Title }, _mapper.Map<ExperienceDTO>(newTraining));
            //return CreatedAtAction(nameof(GetOne), new { training = training.Title }, training);
        }

        [HttpPut]
        public async Task<IActionResult> PutTraining(ExperienceDTO trainingDTO) {
            var training = _mapper.Map<Experience>(trainingDTO);
            var exists = _context.Training.Where( t => t.Title == training.Title).SingleOrDefault();
            if (exists == null)
                return NotFound();
            _mapper.Map<ExperienceDTO, Experience>(trainingDTO, exists);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty) return BadRequest(res);
            return NoContent();
        }

        [HttpDelete("{titre}")]
        public async Task<IActionResult> DeleteTraining(string titre) {
            var training = await _context.Training.FindAsync(titre);
            if (training == null)
                return NotFound();
            _context.Training.Remove(training);
            await _context.SaveChangesAsync();
            return NoContent();
        }




    }

}