
using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models {
  public class Skill : IValidatableObject {
   
  [Key]
   public int skillId { get; set;}
   
   public string Name {get; set; }

   public int categoryId { get; set; }

   public Category category { get; set;}

   public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            var currContext = validationContext.GetService(typeof(MainContext)) as MainContext;
            Debug.Assert(currContext != null);
            yield return new ValidationResult(null);
            
    }

  }

}