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
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using backend.Helpers;

namespace prid_2122_g04.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillsController : ControllerBase{
        private readonly MainContext _context;
        private readonly IMapper _mapper;

        public SkillsController(MainContext context, IMapper mapper){
            this._context = context;
            this._mapper = mapper;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SkillDto>>> GetAll() {
            return _mapper.Map<List<SkillDto>>(await _context.Skills.Include(e => e.category).ToListAsync());
        }
        [AllowAnonymous]
        [HttpGet("/skillsToAdd/{id}")]
        public async Task<ActionResult<IEnumerable<SkillDto>>> GetSkillsToAdd(int id) {
            var query = from s in _context.Skills
                        join u in _context.Usings on s.skillId equals u.SkillId
                        join m in _context.Masterings on s.skillId equals m.SkillId
                        where u.experience.UserId == id && u.SkillId == s.skillId
                        select s;

             


             return _mapper.Map<List<SkillDto>>(await query.Include(c => c.category).ToListAsync()); 
        }

        private Boolean isSkillInMastering(int id, List<Mastering> masterings){
            foreach(Mastering m in masterings){
                if(id == m.SkillId){
                    return true;
                }
            }
            return false;
        }


        [HttpGet("~/getSkillById")]
        public async Task<ActionResult<SkillDto>> GetOne(int id) {
        var skill = await _context.Skills.FindAsync(id);
        if (skill == null)
            return NotFound();
        return _mapper.Map<SkillDto>(skill);
        }

        [AllowAnonymous]
        [HttpGet("{name}")]
        public async Task<ActionResult<SkillDto>> GetOneByName(String name) {
            //Console.WriteLine("NAME : "+name);
            var skill = await _context.Skills.Include(s => s.category).SingleOrDefaultAsync(skill => skill.Name == name);
            if (skill == null)
                return NotFound();
            return _mapper.Map<SkillDto>(skill);
        }

        [AllowAnonymous]
        [HttpGet("getCategory/{skill}")]
        public async Task<ActionResult<CategoryDto>> GetCategory(SkillDto  sk) {
            var category = await _context.Categories.FindAsync(sk.categoryId);
            if(category == null)
                return NotFound();
            return _mapper.Map<CategoryDto>(category);
        }


        [HttpPut]
        public async Task<IActionResult> PutSkill(SkillDto dto) {
            var skill = await _context.Skills.FindAsync(dto.skillId);
            if (skill == null)
                return NotFound();
            _mapper.Map<SkillDto, Skill>(dto, skill);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSkill(int id) {
            var skill = await _context.Skills.FindAsync(id);
            if (skill == null)
                return NotFound();
                _context.Skills.Remove(skill);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<SkillDto>> PostSkill(SkillDto skill) {
            Console.WriteLine("arrive backend : "+skill.Name);
            var newSkill = _mapper.Map<Skill>(skill);
            _context.Skills.Add(newSkill);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            return CreatedAtAction(nameof(GetOne), new { skill = skill.skillId }, _mapper.Map<SkillDto>(newSkill));
        }
    }
}