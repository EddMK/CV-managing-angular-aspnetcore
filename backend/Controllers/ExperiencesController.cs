using System;
using System.Diagnostics;
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
        public async Task<ActionResult<IEnumerable<ExperienceDTO>>> GetAll() {//OK
            // Récupère une liste de tous les membres
            return _mapper.Map<List<ExperienceDTO>>(await _context.Experience.ToListAsync());
        }

        [HttpGet("getTrainingById/{id}")]
        public async Task<ActionResult<IEnumerable<ExperienceDTO>>> GetAllTraingById(int id) {//OK
           return _mapper.Map<List<ExperienceDTO>>(await _context.Experience.Where(t => t.Role == ExperienceRole.TRAINING && t.UserId == id).ToListAsync());
        }
        
        [HttpGet("{titre}")]
        public async Task<ActionResult<ExperienceDTO>> GetOne(int  id) {//OK
            var train = await _context.Experience.FindAsync(id);
            if (train == null)
                return NotFound();
            return _mapper.Map<ExperienceDTO>(train);
        }

        [HttpPost]
        public async Task<ActionResult<ExperienceDTO>> PostTraining(ExperienceDTO training) {// X
            var newTraining = _mapper.Map<Experience>(training);
            Console.WriteLine(newTraining.GetType());
            _context.Experience.Add(newTraining);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty) return BadRequest(res);
            return CreatedAtAction(nameof(GetOne), new { training = training.IdExperience }, _mapper.Map<ExperienceDTO>(newTraining));
            //return CreatedAtAction(nameof(GetOne), new { training = training.Title }, training);
        }

        [HttpPut]
        public async Task<IActionResult> PutTraining(ExperienceDTO trainingDTO) {
            var exists = await _context.Experience.FindAsync(trainingDTO.IdExperience);
            if (exists == null)
                return NotFound();
            _mapper.Map<ExperienceDTO, Experience>(trainingDTO, exists);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty) return BadRequest(res);
            return NoContent();
        }

        [HttpDelete("{id}")]//ok
        public async Task<IActionResult> DeleteTraining(int  id) {
            var training = await _context.Experience.FindAsync(id);
            if (training == null)
                return NotFound();
            _context.Experience.Remove(training);
            await _context.SaveChangesAsync();
            return NoContent();
        }




    }

}