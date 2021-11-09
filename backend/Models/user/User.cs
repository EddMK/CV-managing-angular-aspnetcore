using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;


namespace backend.Models
{
    public enum UserRole {
        MANAGER = 0, CONSULTANT = 1
    }
    public class User : IValidatableObject
    {
        [Key]
        public int userId { get; set;}
        
        [Required(ErrorMessage = "Required")]
        [MinLength(3, ErrorMessage = "Minimum 3 characters"), StringLength(10, ErrorMessage = "Maximum 10 characters"),]
        public string Pseudo { get; set; }

        [Required(ErrorMessage = "Required")]
        [MinLength(3, ErrorMessage = "Minimum 3 characters"), StringLength(10, ErrorMessage = "Maximum 10 characters") ]
        public string Password { get; set; }
        
        [Required]
        public string Email { get; set; }

        [MinLength(3, ErrorMessage = "Minimum 3 characters"),  StringLength(50, ErrorMessage = "Maximum 50 characters")]
        public string FirstName { get; set; }
        
        [MinLength(3, ErrorMessage = "Minimum 3 characters"),  StringLength(50, ErrorMessage = "Maximum 50 characters")]
        public string LastName { get; set; }

        public DateTime? BirthDate { get; set; }

        public UserRole Role { get; set;}

        
        public User(string pseudo, string password, string email, string firtsname, string lastname, DateTime birthday, UserRole role, int userId = 0){
            this.Pseudo = pseudo;
            this.Password = password;
            this.Email = email;
            this.FirstName = firtsname;
            this.LastName = lastname;
            this.BirthDate = birthday;
            this.Role = role;
            this.userId = userId;
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

        
        public bool CheckPseudoUnicity(MainContext context) {
          
            return context.Entry(this).State == EntityState.Modified || context.Users.AsNoTracking().Count(u => u.Pseudo == Pseudo) == 0;
        }
        public bool isPseudoValid(){
            return !Pseudo.Contains('_') && Char.IsLetter(Pseudo[0]);
        }

        private bool CheckLastNameUnicity(MainContext context) {
            if (string.IsNullOrEmpty(LastName)) 
                return true;
            return context.Users.Count(u => u.Pseudo != Pseudo && u.LastName == LastName) == 0;
        }
        private bool CheckFirstNameUnicity(MainContext context){
             if (string.IsNullOrEmpty(LastName)) 
                return true;
            return context.Users.Count(u => u.Pseudo != Pseudo && u.LastName == LastName) == 0;
        }

        public bool CheckFullNameUnicity(MainContext context){
            return CheckFirstNameUnicity(context) && CheckLastNameUnicity(context);
        }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            var currContext = validationContext.GetService(typeof(MainContext)) as MainContext;
            Debug.Assert(currContext != null);
            if (!CheckPseudoUnicity(currContext))
                yield return new ValidationResult("The Pseudo of a user must be unique", new[] { nameof(Pseudo) });
            if(!isPseudoValid())
                yield return new ValidationResult("The Pseudo can't contain an underscore and the first character should be a letter", new[] { nameof(Pseudo) });
            if (!CheckFullNameUnicity(currContext))
                 yield return new ValidationResult("The combinaison of a firstname and fullname should be unique", new[] { nameof(LastName) });
            if (Password == "abc")
                 yield return new ValidationResult("The password may not be equal to 'abc'", new[] { nameof(Password) });
             if (BirthDate.HasValue && BirthDate.Value.Date > DateTime.Today)
               yield return new ValidationResult("Can't be born in the future in this reality", new[] { nameof(BirthDate) });
              else if (Age.HasValue && Age < 18)
                  yield return new ValidationResult("Must be 18 years old", new[] { nameof(BirthDate) });
        }
        
    }
        
    
}
