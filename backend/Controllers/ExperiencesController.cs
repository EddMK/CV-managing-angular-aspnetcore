using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
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
            return _mapper.Map<List<ExperienceDTO>>(await _context.Experience.Include(e => e.Enterprise).Include(e => e.usings).ThenInclude(s => s.skill).ToListAsync());
        }

        [HttpGet("getTrainingById/{id}")]
        public async Task<ActionResult<IEnumerable<ExperienceDTO>>> GetAllTraingById(int id) {//OK
           return _mapper.Map<List<ExperienceDTO>>(await _context.Experience.Where(t => t.Role == ExperienceRole.TRAINING && t.UserId == id)
           .Include(t => t.Enterprise)
           .Include(e => e.usings)
           .ThenInclude(s => s.skill)
           .ThenInclude(c => c.category)
           .ToListAsync());
        }

         [HttpGet("getMissionById/{id}")]
        public async Task<ActionResult<IEnumerable<ExperienceDTO>>> GetAllMissionById(int id) {//OK
           return _mapper.Map<List<ExperienceDTO>>(await _context.Experience.Where(t => t.Role == ExperienceRole.MISSION && t.UserId == id)
           .Include(t => t.Enterprise)
           .Include(e => e.usings)
           .ThenInclude(s => s.skill)
           .ThenInclude(c => c.category)
           .ToListAsync());
        }


        
        [HttpGet("{titre}")]
        public async Task<ActionResult<ExperienceDTO>> GetOne(int  id) {//OK
            var train = await _context.Experience.FindAsync(id);
            if (train == null)
                return NotFound();
            return _mapper.Map<ExperienceDTO>(train);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<int>> PostTraining(ExperienceDTO training) {// X
            Console.WriteLine("ARRIVE POST !");
            Console.WriteLine("ROLE : "+training.Role);
            int result = DateTime.Compare(training.Finish, new DateTime());
            var newTraining = new Training(){
                UserId = training.UserId, Start = training.Start, Finish = training.Finish,
                IdEnterprise = training.Enterprise.IdEnterprise, Title = training.Title, Description = training.Description,
                Role = ExperienceRole.TRAINING, Grade = training.Grade
            };
            if(result == 0){
                newTraining.Finish = null;
            }
            Console.WriteLine(newTraining.GetType());
            _context.Experience.Add(newTraining);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty) return BadRequest(res);
            //Console.WriteLine("Experience Id : "+newTraining.IdExperience);
            return newTraining.IdExperience;
            //return CreatedAtAction(nameof(GetOne), new { training = training.IdExperience }, _mapper.Map<ExperienceDTO>(newTraining));
            //return CreatedAtAction(nameof(GetOne), new { training = training.Title }, training);
        }

        [AllowAnonymous]
        [HttpPost("addMission/")]
        public async Task<ActionResult<int>> PostMission(ExperienceDTO training) {// X
            Console.WriteLine("ARRIVE POST  MISSION!");
            Console.WriteLine("ROLE : "+training.Finish);
            int result = DateTime.Compare(training.Finish, new DateTime());
            //Console.WriteLine("int result = "+result);
            var newTraining = new Mission(){
                UserId = training.UserId, Start = training.Start, Finish = training.Finish,
                IdEnterprise = training.Enterprise.IdEnterprise, Title = training.Title, Description = training.Description,
                Role = ExperienceRole.MISSION};
            if(result == 0){
                newTraining.Finish = null;
            }
            Console.WriteLine(newTraining.GetType());
            _context.Experience.Add(newTraining);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty) return BadRequest(res);
            //Console.WriteLine("Experience Id : "+newTraining.IdExperience);
            return newTraining.IdExperience;
            //return CreatedAtAction(nameof(GetOne), new { training = training.IdExperience }, _mapper.Map<ExperienceDTO>(newTraining));
            //return CreatedAtAction(nameof(GetOne), new { training = training.Title }, training);
        }

        [AllowAnonymous]
        [HttpPut]
        public async Task<IActionResult> Put(ExperienceDTO dto) {
            //Console.WriteLine("date start training : " + dto.Start);
            var exists = await _context.Trainings.FindAsync(dto.IdExperience);
            exists.Description = dto.Description;
            exists.Start = dto.Start;
            exists.Finish = dto.Finish;
            exists.Title = dto.Title;
            exists.Grade = dto.Grade;
            if (exists == null)
                return NotFound();
            //_mapper.Map<ExperienceDTO, Experience>(trainingDTO, exists);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty) return BadRequest(res);
            return NoContent();
        }

        [AllowAnonymous]
        [HttpPut("updateMission/")]
        public async Task<IActionResult> PutMission(ExperienceDTO dto) {
            //Console.WriteLine("role : " + dto.Role);
            var exists = await _context.Experience.FindAsync(dto.IdExperience);
            exists.Description = dto.Description;
            exists.Start = dto.Start;
            exists.Finish = dto.Finish;
            exists.Title = dto.Title;
            if (exists == null)
                return NotFound();
            //_mapper.Map<ExperienceDTO, Experience>(trainingDTO, exists);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty) return BadRequest(res);
            return NoContent();
        }

        [HttpDelete("{id}")]//ok
        public async Task<IActionResult> DeleteMission(int  id) {
            Console.WriteLine("Id recu au backend : "+ id);
            var experience = await _context.Experience.FindAsync(id);
            Console.WriteLine("BACKEND envoye : "+experience.IdExperience);
            if (experience == null)
                return NotFound();
            _context.Experience.Remove(experience);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

}