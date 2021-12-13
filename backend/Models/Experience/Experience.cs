using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using PRID_Framework;
using System.ComponentModel.DataAnnotations.Schema;





namespace backend.Models {

    public enum ExperienceRole {
        TRAINING = 0, MISSION = 1
    }
    public abstract class Experience : IValidatableObject {
        
        [Key]
        public int IdExperience { get;set;}

        [ForeignKey(nameof(User))]
        public int userId { get; set; }

         public User User { get; set; }

        public DateTime Start { get;set;}
        [Required (ErrorMessage = "Required")]
        public DateTime Finish { get;set;}
        [Required (ErrorMessage = "Required")]


        public string Title { get;set;}

        public string Description { get;set;}

        public ExperienceRole Role { get; set;}

        public Enterprise enterprise;

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            var currContext = validationContext.GetService(typeof(MainContext)) as MainContext;
            Debug.Assert(currContext != null);
            if(Finish<Start){
                yield return new ValidationResult("The Date of finish must be older than the start Date", null );
            }
        }

    }

}