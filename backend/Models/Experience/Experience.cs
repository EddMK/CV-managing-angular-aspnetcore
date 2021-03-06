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
        public int UserId { get; set; }

         public User User { get; set; }

        public DateTime Start { get;set;}
        //[Required (ErrorMessage = "Required")]
        public Nullable < DateTime > Finish { get;set;}
        [Required (ErrorMessage = "Required")]
        
        [ForeignKey(nameof(Enterprise))]
        public int IdEnterprise { get; set; }
        public Enterprise Enterprise { get; set; }

        public string Title { get;set;}

        public string Description { get;set;}

        public ExperienceRole Role { get; set;}


         public ICollection<Using> usings { get; set; } = new HashSet<Using>();


        public Experience(User user, DateTime start, DateTime finish, string title, string description, ExperienceRole role, Enterprise enterprise, int id){
            this.UserId = user.UserId;
            this.User = user;
            this.Start = start;
            this.Finish = finish;
            this.Title = title;
            this.Description = description;
            this.Role = role;
            this.Enterprise = enterprise;
            this.IdExperience = id;
        }


        public Experience(){
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