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
    public class EnterprisesController : ControllerBase{

        private readonly MainContext _context;
        private readonly IMapper _mapper;

        public EnterprisesController(MainContext context, IMapper mapper) {
            _context = context;
            _mapper = mapper;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EnterpriseDto>>> GetAll() {//OK
            return _mapper.Map<List<EnterpriseDto>>(await _context.Enterprises.ToListAsync());
        }

        [HttpGet("~/getEnterpriseById")]
        public async Task<ActionResult<EnterpriseDto>> GetOne(int id) {
        var enterprise = await _context.Enterprises.FindAsync(id);
        if (enterprise == null)
            return NotFound();
        return _mapper.Map<EnterpriseDto>(enterprise);
        }


        [AllowAnonymous]
        [HttpGet("{name}")]
        public async Task<ActionResult<EnterpriseDto>> GetOneByName(String name) {
            var enterprise = await _context.Enterprises.SingleOrDefaultAsync(e => e.Name == name);
            if (enterprise == null)
                return NotFound();
            return _mapper.Map<EnterpriseDto>(enterprise);
        }

        [Authorized(Role.MANAGER)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEnterprise(int id) {
            var enterprise = await _context.Enterprises.FindAsync(id);
            if (enterprise == null)
                return NotFound();
                _context.Enterprises.Remove(enterprise);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorized(Role.MANAGER)]
        [HttpPut]
        public async Task<IActionResult> PutEnterprise(EnterpriseDto dto) {
            var enterprise = await _context.Enterprises.FindAsync(dto.IdEnterprise);
            if (enterprise == null)
                return NotFound();
            _mapper.Map<EnterpriseDto, Enterprise>(dto, enterprise);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            return NoContent();
        }

        [Authorized(Role.MANAGER)]
        [HttpPost]
        public async Task<ActionResult<EnterpriseDto>> PostEnterprise(EnterpriseDto enterprise) {
            var newEnterprise = _mapper.Map<Enterprise>(enterprise);
            _context.Enterprises.Add(newEnterprise);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            return CreatedAtAction(nameof(GetOne), new { skill = newEnterprise.IdEnterprise }, _mapper.Map<EnterpriseDto>(newEnterprise));
        }

    }
}