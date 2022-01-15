using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;


using PRID_Framework;

 namespace backend.Models {

    public class Category : IValidatableObject {


     [Key]
    public int categoryId {get; set;}

    [Required]
    public string Name { get; set;}

    public Category(){}

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            var currContext = validationContext.GetService(typeof(MainContext)) as MainContext;
            Debug.Assert(currContext != null);
            yield return new ValidationResult(null);
            
    }


    }


 }