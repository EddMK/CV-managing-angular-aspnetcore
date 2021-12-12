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







}