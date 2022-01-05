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
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMasterings([FromBody]List<MasteringDto> masterings, int id) {
            var m = await _context.Masterings.Where(m => m.userId == id).Include(s => s.Skill)
                                             .ThenInclude(c => c.category)
                                             .ToListAsync();
            if (m == null){
                return NotFound();
            }
            else {
              for(int i = 0; i < m.Count; ++i){
                  // m[i] =  _mapper.Map<Mastering>(masterings[i]);
                  // just to test
                  m[i].Level = Level.Intermediate;
                   Console.WriteLine(i);
                    _context.SaveChanges();
              }
              
            }
            return NoContent();
        }









}