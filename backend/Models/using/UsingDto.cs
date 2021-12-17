using System;

namespace backend.Models
{

    public class UsingDto {
         
    public int Id { get; set; }

    public int ExperienceId { get; set; } 
    public Experience experience { get; set;}

    public int SkillId {get; set; }
    public Skill skill { get; set; }

    }
}