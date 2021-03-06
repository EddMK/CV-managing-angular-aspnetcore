
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;

namespace backend.Models {

  public enum Level {
    Beginner = 0 , Intermediate = 1, Advanced = 2, Expert = 3
    
  }

  public class Mastering : IValidatableObject {
    
    [Key]
    public int masteringId { get; set; }
   [ForeignKey(nameof(User))]
    public int userId { get; set; }
    public User User { get; set; }

    [ForeignKey(nameof(Skill))]
    public int SkillId { get; set; }
    public Skill Skill { get; set; }

  
    public Level Level { get; set; }

     public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            var currContext = validationContext.GetService(typeof(MainContext)) as MainContext;
            Debug.Assert(currContext != null);
            yield return new ValidationResult(null);
            
    }

    public void setLevel(string newLevel){
      if(newLevel == "Beginner"){
         this.Level = Level.Beginner;
      }
    }





      

  }

}
