
using System;
using System.Collections.Generic;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;

namespace backend.Models {
  public class Using :  IValidatableObject {

    [Key]
    public int Id { get; set; }

    [ForeignKey(nameof(User))]
    public int ExperienceId { get; set; } 
    public Experience experience { get; set;}

    [ForeignKey(nameof(Skill))]
    public int SkillId {get; set; }
    public Skill skill { get; set; }


     public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            var currContext = validationContext.GetService(typeof(MainContext)) as MainContext;
            Debug.Assert(currContext != null);
            yield return new ValidationResult(null);
            
    }
      

  }

}