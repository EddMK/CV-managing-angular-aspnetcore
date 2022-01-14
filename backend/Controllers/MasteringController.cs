using AutoMapper;
using PRID_Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using backend.Helpers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class MasteringController : ControllerBase
{
    private readonly MainContext _context;
    private readonly IMapper _mapper;

    public MasteringController(MainContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MasteringDto>>> GetAll() {
        return _mapper.Map<List<MasteringDto>>(await _context.Masterings.Include(s => s.Skill)
            .ThenInclude(c => c.category)
            .ToListAsync());
    }
    
    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<IEnumerable<MasteringDto>>> GetAllById(int id) {
        return _mapper.Map<List<MasteringDto>>(await _context.Masterings.Where(m => m.userId == id).Include(s => s.Skill)
            .ThenInclude(c => c.category)
            .ToListAsync());
    }


    [AllowAnonymous]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id) {
        var mastering = await _context.Masterings.FindAsync(id);
        if (mastering == null)
            return NotFound();
        _context.Masterings.Remove(mastering);
        await _context.SaveChangesAsync();
        return NoContent();
    }


       [AllowAnonymous]
       [HttpPost("{userid}/{level}")]
       public async Task<ActionResult<MasteringDto>> PostMastering(SkillDto s, int userid, int level){
            Console.WriteLine("arrived here in the mastering controller");
            Console.WriteLine("skill : "+s.Name);
            Console.WriteLine("userid : "+userid);
            Console.WriteLine("level : "+level);
            Mastering m =  new Mastering { userId=userid, SkillId= s.skillId,  Level = (Level)level};
            _context.Masterings.Add(m);
            var res = await _context.SaveChangesAsync();
   
           if (res == 0){
            return BadRequest(res);
            }
            return CreatedAtAction(nameof(GetOne), new { mastering = m.masteringId }, _mapper.Map<MasteringDto>(m));
          
       }


    [HttpGet("~/getMasteringById")]
    public async Task<ActionResult<MasteringDto>> GetOne(int id) {
        var mastering = await _context.Masterings.FindAsync(id);
        if (mastering == null)
            return NotFound();
        return _mapper.Map<MasteringDto>(mastering);
    }

    [AllowAnonymous]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutMasterings(int id, [FromBody]int level) {
        var m = await _context.Masterings.Where(m => m.masteringId == id).Include(s => s.Skill)
                                             .ThenInclude(c => c.category)
                                             .SingleAsync();
        if (m == null){
            return NotFound();
        }
        else {
                if(level == 0){
                    m.Level = Level.Beginner;
                }
                else if(level == 1){
                    m.Level = Level.Intermediate;
                }
                else if(level == 2){
                    m.Level = Level.Advanced;
                }
                else {
                    m.Level = Level.Expert;
                }
                _context.SaveChanges();
        }
        return NoContent();
    }









}