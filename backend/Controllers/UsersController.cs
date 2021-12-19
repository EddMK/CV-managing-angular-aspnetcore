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


[Authorize]
[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly MainContext _context;
    private readonly IMapper _mapper;

    /*
    Le contrôleur est instancié automatiquement par ASP.NET Core quand une requête HTTP est reçue.
    Les deux paramètres du constructeur recoivent automatiquement, par injection de dépendance, 
    une instance du context EF (MsnContext) et une instance de l'auto-mapper (IMapper).
    */
    public UsersController(MainContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }
    
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDTO>>> GetAll() {
      
      return _mapper.Map<List<UserDTO>>(await _context.Users.Include(u => u.masterings)
       .ThenInclude(s => s.Skill)
       .ThenInclude(c => c.category)
       .Include(u => u.experiences)
       .ToListAsync());
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDTO>> GetOne(int id) {
      // Récupère en BD le membre dont le pseudo est passé en paramètre dans l'url
        var user = await _context.Users.Include(u => u.masterings)
        //.ThenInclude(s => s.Skill)
        .SingleAsync(u => u.userId == id);

    
      // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
       if (user == null)
           return NotFound();
      // Transforme le membre en son DTO et retourne ce dernier
    return _mapper.Map<UserDTO>(user);
    }
    
    //[Authorized(Role.MANAGER)]
    //[HttpPost]
    [AllowAnonymous]
    [HttpPost("postuser")]
    public async Task<ActionResult<UserDTO>> PostUser(UserWithPasswordDTO user) {
    // Utilise le mapper pour convertir le DTO qu'on a reçu en une instance de Member
      Console.WriteLine("Arrrivé");
      Console.WriteLine("user" + user.BirthDate);
      //var newuser = _mapper.Map<Consultant>(user);
      var newuser = new Consultant()
            {Pseudo = user.Pseudo, Password = user.Password, Email= user.Email, 
            FirstName= user.Firstname, LastName= user.Lastname, Title= user.title
            ,BirthDate= user.BirthDate, Role = Role.CONSULTANT, userId = 0};
      // Ajoute ce nouveau membre au contexte EF
       _context.Users.Add(newuser);
       // Sauve les changements
       var res = await _context.SaveChangesAsyncWithValidation();
       if (!res.IsEmpty)
          return BadRequest(res);

    return null;
    // Renvoie une réponse ayant dans son body les données du nouveau membre (3ème paramètre)
    // et ayant dans ses headers une entrée 'Location' qui contient l'url associé à GetOne avec la bonne valeur 
    // pour le paramètre 'pseudo' de cet url.
    //return CreatedAtAction(nameof(GetOne), new { pseudo = user.Pseudo }, _mapper.Map<UserDTO>(newuser));
    }
/*
    [AllowAnonymous]
    [HttpPost("postuser")]
    public async Task<ActionResult<UserDTO>> AddNewUser(UserWithPasswordDTO user) {
        Console.WriteLine("Arrrivé");
        return null;
    }
*/
    [HttpPut]
    public async Task<IActionResult> PutUser(UserWithPasswordDTO dto) {
       // Récupère en BD le membre à mettre à jour
       var user = await _context.Users.Include(u => u.masterings).SingleAsync(u => u.userId == dto.userId);
       // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
       if (user == null)
           return NotFound();
            // S'il n'y a pas de mot de passe dans le dto, on garde le mot de passe actuel
    if (string.IsNullOrEmpty(dto.Password))
        dto.Password = user.Password;
       // Mappe les données reçues sur celles du membre en question
       _mapper.Map<UserWithPasswordDTO, User>(dto, user);
       // Sauve les changements
       var res = await _context.SaveChangesAsyncWithValidation();
       if (!res.IsEmpty)
           return BadRequest(res);
       // Retourne un statut 204 avec une réponse vide
      return NoContent();
    }


    [HttpDelete("{pseudo}")]
    public async Task<IActionResult> DeleteUser(int id) {
       // Récupère en BD le membre à supprimer
       var user = await _context.Users.FindAsync(id);
       // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
       if (user == null)
          return NotFound();
       // Indique au contexte EF qu'il faut supprimer ce membre
        _context.Users.Remove(user);
        // Sauve les changements
       await _context.SaveChangesAsync();
       // Retourne un statut 204 avec une réponse vide
    return NoContent();
}

[AllowAnonymous]
[HttpPost("authenticate")]
public async Task<ActionResult<UserDTO>> Authenticate(UserWithPasswordDTO dto) {
    var user = await Authenticate(dto.Email, dto.Password);

    if (user == null)
        return BadRequest(new ValidationErrors().Add("User not found", "wrong id"));
    if (user.Token == null)
        return BadRequest(new ValidationErrors().Add("Incorrect password", "Password"));

    return Ok(_mapper.Map<UserDTO>(user));
}

private async Task<User> Authenticate(string email, string password) {
    var user = await _context.Users.Where(u => u.Email == email).FirstOrDefaultAsync();

    // return null if user not found
    if (user == null){
        Console.WriteLine("user nuuulll");
        return null;
    }

    if (user.Password == password) {
        // authentication successful so generate jwt token
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes("my-super-secret-key");
        var tokenDescriptor = new SecurityTokenDescriptor {
            Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(ClaimTypes.Name, user.userId.ToString()),
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
