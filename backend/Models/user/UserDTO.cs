using System;
using System.Collections.Generic;

namespace backend.Models
{

    public class UserDTO
    {

        public int userId { get; set; }
       
        public string Pseudo { get; set; }

        public string Firstname { get; set; }
        
        public string Lastname { get; set; }

        public string title { get; set; }
        
        public string Email { get; set; }

        public DateTime BirthDate { get; set; }

        public string Role { get; set; }

       public string Token { get; set; }

       public ICollection<MasteringDto> Masterings { get; set; }

       public ICollection<ExperienceDTO> Experiences { get; set; }
        
        
    }
    public class UserWithPasswordDTO : UserDTO
    {
        public string Password { get; set; }
    }
}