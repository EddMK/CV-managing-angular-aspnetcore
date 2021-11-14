using System;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace prid_2122_g04.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExperiencesController : ControllerBase{

        private readonly MainContext _context;

        public ExperiencesController(MainContext context){
            this._context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Experience>>> GetAllTraining() {
            // Récupère une liste de tous les membres
            return await _context.Training.ToListAsync();
        }

    }

}