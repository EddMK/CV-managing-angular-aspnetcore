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
           List<Experience> dateFinishNull = await  _context.Experience.Where( t => t.Role == ExperienceRole.TRAINING && t.UserId == id && t.Finish == null)
                        .OrderByDescending( t=> t.Start).Include(t => t.Enterprise).Include(e => e.usings).ThenInclude(s => s.skill).ThenInclude(c => c.category).ToListAsync();
           List<Experience> dateFinishNonNull = await _context.Experience.Where(t => t.Role == ExperienceRole.TRAINING && t.UserId == id && t.Finish != null)
                        .OrderByDescending( t=> t.Finish).Include(t => t.Enterprise).Include(e => e.usings).ThenInclude(s => s.skill).ThenInclude(c => c.category).ToListAsync();
            dateFinishNull.AddRange(dateFinishNonNull);
           return _mapper.Map<List<ExperienceDTO>>( dateFinishNull);
        }

         [HttpGet("getMissionById/{id}")]
        public async Task<ActionResult<IEnumerable<ExperienceDTO>>> GetAllMissionById(int id) {//OK
            List<Mission> dateFinishNull = await  _context.Missions.Where( t => t.Role == ExperienceRole.MISSION && t.UserId == id && t.Finish == null)
                        .OrderByDescending( t=> t.Start).Include(t => t.Enterprise).Include(c => c.client).Include(e => e.usings).ThenInclude(s => s.skill).ThenInclude(c => c.category).ToListAsync();
           List<Mission> dateFinishNonNull = await _context.Missions.Where(t => t.Role == ExperienceRole.MISSION && t.UserId == id && t.Finish != null)
                        .OrderByDescending( t=> t.Finish).Include(t => t.Enterprise).Include(c => c.client).Include(e => e.usings).ThenInclude(s => s.skill).ThenInclude(c => c.category).ToListAsync();
            dateFinishNull.AddRange(dateFinishNonNull);
            return _mapper.Map<List<ExperienceDTO>>( dateFinishNull);
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
        public async Task<ActionResult<int>> Post(ExperienceDTO experience) {
            int result = DateTime.Compare(experience.Finish, new DateTime());
            Experience newExperience = new Mission(){
                UserId = experience.UserId, Start = experience.Start, Finish = experience.Finish,
                IdEnterprise = experience.Enterprise.IdEnterprise, Title = experience.Title, Description = experience.Description,
                Role = ExperienceRole.MISSION};
            if(experience.Role == "TRAINING"){
                newExperience = new Training(){
                    UserId = experience.UserId, Start = experience.Start, Finish = experience.Finish,
                    IdEnterprise = experience.Enterprise.IdEnterprise, Title = experience.Title, Description = experience.Description,
                    Role = ExperienceRole.TRAINING, Grade = experience.Grade
                };
            }
            if(result == 0){
                newExperience.Finish = null;
            }
            _context.Experience.Add(newExperience);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty) return BadRequest(res);
            return newExperience.IdExperience;
        }

        [AllowAnonymous]
        [HttpPut]
        public async Task<IActionResult> Put(ExperienceDTO dto) {
            Console.WriteLine("UPDATE role : "+dto.Role);
            if(dto.Role == "MISSION"){
                Experience exists = await _context.Experience.FindAsync(dto.IdExperience);
                exists.Description = dto.Description;
                exists.Start = dto.Start;
                exists.Finish = dto.Finish;
                exists.Title = dto.Title;
                if (exists == null)return NotFound();
            }else{
                Training exists = await _context.Trainings.FindAsync(dto.IdExperience);
                exists.Description = dto.Description;
                exists.Start = dto.Start;
                exists.Finish = dto.Finish;
                exists.Title = dto.Title;
                exists.Grade = dto.Grade;
                if (exists == null)return NotFound();
            }
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