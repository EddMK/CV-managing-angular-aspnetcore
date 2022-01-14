using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;



namespace backend.Models
{
    public enum Role {
        MANAGER = 0, CONSULTANT = 1
    }
    public abstract class User : IValidatableObject
    {
        [Key]
        public int UserId { get; set;}
        
        [Required(ErrorMessage = "Required")]
        [MinLength(3, ErrorMessage = "Minimum 3 characters"), StringLength(10, ErrorMessage = "Maximum 10 characters") ]
        public string Password { get; set; }
        
        [Required(ErrorMessage ="Required")]
        [EmailAddress]
        public string Email { get; set; }

        [Required(ErrorMessage = "Required")]
        [MinLength(3, ErrorMessage = "Minimum 2 characters"),  StringLength(30, ErrorMessage = "Maximum 30 characters")]
        public string FirstName { get; set; }


        [Required(ErrorMessage = "Required")]
        [MinLength(3, ErrorMessage = "Minimum 2 characters"),  StringLength(30, ErrorMessage = "Maximum 30 characters")]
        public string LastName { get; set; }
        
         [Required(ErrorMessage = "Required")]
         [MinLength(3, ErrorMessage = "Minimum 2 characters"),  StringLength(30, ErrorMessage = "Maximum 30 characters")]
        public String Title { get; set; }
         
        [Required(ErrorMessage = "Required")]
    
        public DateTime? BirthDate { get; set; }

        public Role Role { get; set;}
        
        [StringLength(200, ErrorMessage = "Maximum 200 characters")]
        public string About { get; set; }


        [NotMapped]
        public string Token { get; set; }

      
       public ICollection<Mastering> masterings { get; set; } = new HashSet<Mastering>();

       public ICollection<Experience> experiences { get; set; } = new HashSet<Experience>();

    
        public User(string password, string email, string firtsname, string lastname, string title, DateTime birthday, Role role, string about, int userId = 0){
            this.Password = password;
            this.Email = email;
            this.FirstName = firtsname;
            this.LastName = lastname;
            this.BirthDate = birthday;
            this.Role = role;
            this.About = about;
            this.Title = Title;
            this.UserId = userId;
          
        }

        public User(){}

        public int? Age {
            get {
                if (!BirthDate.HasValue)
                    return null;
                var today = DateTime.Today;
                var age = today.Year - BirthDate.Value.Year;
                if (BirthDate.Value.Date > today.AddYears(-age)) age--;
                return age;
            }
        }

        private bool checkEmailUnicity(MainContext context) {
            if(string.IsNullOrEmpty(Email))
                 return true;
             return context.Users.Count(u => u.Email == Email) == 0;    
        }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            var currContext = validationContext.GetService(typeof(MainContext)) as MainContext;
            Debug.Assert(currContext != null);
            if (!checkEmailUnicity(currContext))
                 yield return new ValidationResult("The email should be unique", new[] { nameof(Email) });
            if (Password == "abc" || Password == "123")
                 yield return new ValidationResult("The password may not be equal to 'abc' or 123", new[] { nameof(Password) });
             if (BirthDate.HasValue && BirthDate.Value.Date > DateTime.Today)
               yield return new ValidationResult("Can't be born in the future in this reality", new[] { nameof(BirthDate) });
              else if (Age.HasValue && Age < 18)
                  yield return new ValidationResult("Must be 18 years old", new[] { nameof(BirthDate) });
        }
        
    }
        
    
}
