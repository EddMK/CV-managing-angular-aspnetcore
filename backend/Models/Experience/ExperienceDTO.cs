using System;

namespace backend.Models {
    public class ExperienceDTO{

        public int IdExperience {get;set;}
        public DateTime Start { get;set;}
        public DateTime Finish { get;set;}
        public string Title { get;set;}
        public string Description { get;set;}
        public ExperienceRole Role { get; set;}

    }
}