using System;

namespace backend.Models {
    public class ExperienceDTO{

        public int IdExperience {get;set;}

        public int UserId { get; set; }

        public DateTime Start { get;set;}
        public DateTime Finish { get;set;}
        public string Title { get;set;}
        public string Description { get;set;}
        public string Role { get; set;}

        

     
    
    }
  

    
}