using AutoMapper;
//using PRID_Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;


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
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDTO>>> GetAll() {
    
      return _mapper.Map<List<UserDTO>>(await _context.Users.ToListAsync());
    }
    [HttpGet("{pseudo}")]
    public async Task<ActionResult<UserDTO>> GetOne(int id) {
      // Récupère en BD le membre dont le pseudo est passé en paramètre dans l'url
        var user = await _context.Users.FindAsync(id);
      // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
       if (user == null)
           return NotFound();
      // Transforme le membre en son DTO et retourne ce dernier
    return _mapper.Map<UserDTO>(user);
    }
    [HttpPost]
    public async Task<ActionResult<UserDTO>> PostUser(UserWithPasswordDTO user) {
    // Utilise le mapper pour convertir le DTO qu'on a reçu en une instance de Member
      var newuser = _mapper.Map<User>(user);
      // Ajoute ce nouveau membre au contexte EF
       _context.Users.Add(newuser);
       // Sauve les changements
       var res = await _context.SaveChangesAsyncWithValidation();
       if (!res.IsEmpty)
          return BadRequest(res);

    // Renvoie une réponse ayant dans son body les données du nouveau membre (3ème paramètre)
    // et ayant dans ses headers une entrée 'Location' qui contient l'url associé à GetOne avec la bonne valeur 
    // pour le paramètre 'pseudo' de cet url.
    return CreatedAtAction(nameof(GetOne), new { pseudo = user.Pseudo }, _mapper.Map<UserDTO>(newuser));
    }

    [HttpPut]
    public async Task<IActionResult> PutUser(UserDTO dto) {
       // Récupère en BD le membre à mettre à jour
       var user = await _context.Users.FindAsync(dto.userId);
       // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
       if (user == null)
           return NotFound();
       // Mappe les données reçues sur celles du membre en question
        _mapper.Map<UserDTO, User>(dto, user);
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






}
