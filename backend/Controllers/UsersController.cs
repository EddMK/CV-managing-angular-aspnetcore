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
using System.Diagnostics;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.Text.Json;




[Authorize]
[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly MainContext _context;
    private readonly IMapper _mapper;

    public UsersController(MainContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }
   
    [AllowAnonymous]
    [HttpGet("team/{id}")]
    public async Task<ActionResult<IEnumerable<UserDTO>>> GetTeam(int id) {
      return _mapper.Map<List<UserDTO>>(await _context.Consultants.Where(u => u.managerID == id || u.managerID == null).Include(u => u.masterings)
       .ThenInclude(s => s.Skill)
       .ThenInclude(c => c.category)
       .Include(u => u.experiences)
       .ToListAsync());
    }
    
    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDTO>> GetOne(int id) {
        var user = await _context.Users.Include(u => u.masterings).SingleAsync(u => u.UserId == id);
        if (user == null)
           return NotFound();
        return _mapper.Map<UserDTO>(user);
    }

    [AllowAnonymous]
    [HttpGet("getByEmail/{mail}")]
    public async Task<ActionResult<UserDTO>> GetOneByEmail(string mail) {
        var user = await _context.Users.Where(u => u.Email == mail).FirstOrDefaultAsync();
        if (user == null)
            return NotFound();
        return _mapper.Map<UserDTO>(user);
    }
    
    [AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult<UserDTO>> PostUser(UserWithPasswordDTO user) {
        var newuser = new Consultant()
                {Password = user.Password, Email= user.Email, 
                FirstName= user.Firstname, LastName= user.Lastname, Title= user.title
                ,BirthDate= user.BirthDate, Role = Role.CONSULTANT};
        _context.Users.Add(newuser);
        var res = await _context.SaveChangesAsyncWithValidation();
        if (!res.IsEmpty)
            return BadRequest(res);
        return CreatedAtAction(nameof(GetOne), new { id = newuser.UserId }, _mapper.Map<UserDTO>(newuser));
    }

    [AllowAnonymous]
    [HttpPut]
    public async Task<IActionResult> PutUser(UserDTO dto) {
        var user = await _context.Users.Where(u => u.Email == dto.Email).FirstOrDefaultAsync();
       if (user == null){
           return NotFound();
       }
       else {
           user.FirstName = dto.Firstname;
           user.LastName = dto.Lastname;
           user.Title = dto.title;
           user.About = dto.about;
         
          _context.SaveChanges();
       }
     
      return NoContent();
    }

    [Authorized(Role.MANAGER)]
    [HttpPut("unlink")]
    public async Task<IActionResult> UnLink(UserDTO dto) {
        Console.WriteLine("arrived in the controller");
        var consultant = await _context.Consultants.FindAsync(dto.UserId);
            if (consultant == null){
                return NotFound();
            }
            else {
              consultant.managerID = null;
               _context.SaveChanges();
            }
            return NoContent();
    }

    [Authorized(Role.MANAGER)]
    [HttpPut("link/{id}")]
    public async Task<IActionResult> Link([FromBody]UserDTO dto, int id) {
      var consultant = await _context.Consultants.FindAsync(dto.UserId);
            if (consultant == null){
                return NotFound();
            }
            else {
              consultant.managerID = id;
               _context.SaveChanges();
            }
            return NoContent();
    }

    [Authorized(Role.MANAGER)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id) {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [AllowAnonymous]
    [HttpPost("authenticate")]
    public async Task<ActionResult<UserDTO>> Authenticate(UserWithPasswordDTO dto) {
        var user = await Authenticate(dto.Email, dto.Password);

        if (user == null)
            return BadRequest(new ValidationErrors().Add("User not found", "Email"));
        if (user.Token == null)
            return BadRequest(new ValidationErrors().Add("Incorrect password", "Password"));

        var mapped = _mapper.Map<UserDTO>(user);
        return Ok(mapped);
    }

    private async Task<User> Authenticate(string email, string password) {
        var user = await _context.Users.Where(u => u.Email == email).FirstOrDefaultAsync();

        if (user == null){
            return null;
        }

        if (user.Password == password) {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("my-super-secret-key");
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(new Claim[] {
                        new Claim(ClaimTypes.Name, user.UserId.ToString()),
                        new Claim(ClaimTypes.Role, user.Role.ToString())
                    }),
                IssuedAt = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddMinutes(10),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);
        }
        return user;
    }
}
