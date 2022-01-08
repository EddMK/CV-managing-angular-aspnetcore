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
        [HttpPut]
        public async Task<IActionResult> PutMasterings(MasteringDto dto) {
            var m = await _context.Masterings.Where(m => m.masteringId == dto.masteringId).Include(s => s.Skill)
                                             .ThenInclude(c => c.category)
                                             .SingleAsync();
            if (m == null){
                return NotFound();
            }
            else {
                  Console.WriteLine(m.masteringId + " : " + dto.Level);
                  //m = _mapper.Map<MasteringDto, Mastering>(dto, m);
                
                    m = _mapper.Map<MasteringDto, Mastering>(dto, m);
                 
               
             
                 // _context.SaveChanges();
                   await _context.SaveChangesAsync(); 
                  Console.WriteLine(m.Level + " : " + dto.Level);
            }
            return NoContent();
        }









}