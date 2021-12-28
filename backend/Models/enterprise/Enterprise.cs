
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;

namespace backend.Models {
  public class Enterprise : IValidatableObject {

      [Key]
      public int IdEnterprise;

      [Required]
      public string Name;

      public Enterprise(){ }

      public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            var currContext = validationContext.GetService(typeof(MainContext)) as MainContext;
            Debug.Assert(currContext != null);
            yield return new ValidationResult(null);
            
      }



  }

}