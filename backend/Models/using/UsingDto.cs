using System;

namespace backend.Models
{

    public class UsingDto {
         
    public int Id { get; set; }

    public int ExperienceId { get; set; } 
   // public Experience Experience { get; set;}

    public int SkillId {get; set; }
    public SkillDto Skill { get; set; }

    }
}