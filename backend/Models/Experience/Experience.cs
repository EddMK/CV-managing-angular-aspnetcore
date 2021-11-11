using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using PRID_Framework;

namespace backend.Models {

    public enum ExperienceRole {
        TRAINING = 0, MISSION = 1
    }
    public abstract class Experience : IValidatableObject {
        
        [Key]
        public int IdExperience { get;set;}
        [Required]
        public DateTime Start { get;set;}
        [Required]
        public DateTime Finish { get;set;}
        [Required]
        public String Title { get;set;}

        public String Description { get;set;}

        public ExperienceRole Role { get; set;}


        public Experience(int idexperience, DateTime start, DateTime finish, 
                            String title, String description){
                this.IdExperience = idexperience;
                this.Start = start;
                this.Finish = finish;
                this.Title = title;
                this.Description = description;
                //this.Role = role;


        }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            var currContext = validationContext.GetService(typeof(MainContext)) as MainContext;
            Debug.Assert(currContext != null);
            if(Finish<Start){
                yield return new ValidationResult("The Date of finish must be older than the start Date", null );
            }
        }

    }

}