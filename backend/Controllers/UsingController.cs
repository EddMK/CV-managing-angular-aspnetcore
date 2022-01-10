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
    public class UsingController :  ControllerBase{

        private readonly MainContext _context;
        private readonly IMapper _mapper;

        public UsingController(MainContext context, IMapper mapper){
            this._context = context;
            this._mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsingDto>>> GetAll() {//OK
            // Récupère une liste de tous les membres
            return _mapper.Map<List<UsingDto>>(await _context.Usings.Include(s => s.skill).ThenInclude(c => c.category).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<UsingDto>>> GetAllById(int id) {//OK
            // Récupère une liste de tous les membres
            return _mapper.Map<List<UsingDto>>(await _context.Usings.Where(u => u.experience.UserId == id).Include(s => s.skill).ThenInclude(c => c.category).ToListAsync());
        }


        
        [HttpGet("languages/{id}")]
        public async Task<ActionResult<IEnumerable<UsingDto>>> GetLanguagesById(int id) {//OK
            // Récupère une liste de tous les membres
            return _mapper.Map<List<UsingDto>>(await _context.Usings.Where(u => u.ExperienceId == id && u.skill.category.Name == "Language").Include(s => s.skill).ThenInclude(c => c.category).ToListAsync());
        }

        [HttpGet("databases/{id}")]
        public async Task<ActionResult<IEnumerable<UsingDto>>> GetDatabasesById(int id) {//OK
            // Récupère une liste de tous les membres
            return _mapper.Map<List<UsingDto>>(await _context.Usings.Where(u => u.ExperienceId == id && u.skill.category.Name == "Database").Include(s => s.skill).ThenInclude(c => c.category).ToListAsync());
        }

        [HttpGet("frameworks/{id}")]
        public async Task<ActionResult<IEnumerable<UsingDto>>> GetFrameworksById(int id) {//OK
            // Récupère une liste de tous les membres
            return _mapper.Map<List<UsingDto>>(await _context.Usings.Where(u => u.ExperienceId == id && u.skill.category.Name == "Framework").Include(s => s.skill).ThenInclude(c => c.category).ToListAsync());
        }

        [AllowAnonymous]
        [HttpPost("addUsing/{experienceId}")]
        public async Task<ActionResult<UsingDto>> AddUsing([FromBody]SkillDto dto, int experienceId) {
            var newUsing = new Using(){ ExperienceId = experienceId, SkillId = dto.skillId};
            var skillToAdd = await _context.Skills.Include(s => s.category).SingleOrDefaultAsync(s => s.skillId == dto.skillId);
            newUsing.skill = skillToAdd;
            _context.Usings.Add(newUsing);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            
            return CreatedAtAction(nameof(GetOne), new { experienceId = experienceId, skillId = dto.skillId }, _mapper.Map<UsingDto>(newUsing));

        }

        [HttpGet("~/getOneUsing")]
        public async Task<Using> GetOneUsing(int experienceId, int skillId){
            Console.WriteLine("ARRIVE GETONE");
            var thisUsing = await _context.Usings.Include(u => u.skill).Where(u => u.ExperienceId == experienceId && u.SkillId == skillId).FirstOrDefaultAsync();  
            if (thisUsing == null){
                return null;
            }
            return thisUsing;
        }

        [AllowAnonymous]
        [HttpGet("{experienceId}/{skillId}")]
        public async Task<ActionResult<UsingDto>> GetOne(int experienceId, int skillId) {
            var thisUsing = await _context.Usings.Include(u => u.skill).Where(u => u.ExperienceId == experienceId && u.SkillId == skillId).FirstOrDefaultAsync();  
            Console.WriteLine("ARRIVE GETONE : ");
            //var thisSkill = await _context.Skills.FindAsync(skillId);
            //.skill = thisSkill;
            if (thisUsing == null)
                return NotFound();
            // Transforme le membre en son DTO et retourne ce dernier
            return _mapper.Map<UsingDto>(thisUsing);
        }


        [AllowAnonymous]
        [HttpDelete("{idExperience}/{idSkill}")]
        public async Task<ActionResult> DeleteUsing(int idExperience,int idSkill) {
            var oldUsing = await _context.Usings.Where(u => u.ExperienceId == idExperience && u.SkillId == idSkill).FirstOrDefaultAsync();
            if (oldUsing == null){
                return NotFound();
            }
            _context.Usings.Remove(oldUsing);
            await _context.SaveChangesAsync();
            return NoContent();
        }


    }
}