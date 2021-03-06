using System;
using System.Collections.Generic;

namespace backend.Models
{

    public class UserDTO
    {

        public int UserId { get; set; }

        public string Firstname { get; set; }
        
        public string Lastname { get; set; }

        public string title { get; set; }
        
        public string Email { get; set; }

        public DateTime BirthDate { get; set; }

        public string Role { get; set; }

        public string about { get; set; }

        public string PicturePath { get; set; }

       public string Token { get; set; }
    

       public int managerID { get; set; }


       public UserDTO Manager {get; set; }

       public ICollection<MasteringDto> Masterings { get; set; }

       public ICollection<ExperienceDTO> Experiences { get; set; }

       public ICollection<UserDTO> consultants { get; set; }

    }

    public class UserWithPasswordDTO : UserDTO
    {
        public string Password { get; set; }
    }
}