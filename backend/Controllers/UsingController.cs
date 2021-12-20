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











    }




}