using System;
using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace prid_2122_g04.Controllers
{
    public class ExperiencesController : ControllerBase{

        private readonly MainContext _context;

        public ExperiencesController(MainContext context){
            this._context = context;
        }

    }

}