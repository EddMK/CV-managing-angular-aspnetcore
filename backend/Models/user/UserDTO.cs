using System;

namespace backend.Models
{
    public class UserDTO
    {
        //public int userId { get; set; }

        public string pseudo { get; set; }

        public string firstName { get; set; }
        
        public string lastName { get; set; }
        
        public string email { get; set; }

        public DateTime birthDate { get; set; }

        public UserRole role { get; set; }
        
        
    }
    public class UserWithPasswordDTO : UserDTO
    {
        public string Password { get; set; }
    }
}