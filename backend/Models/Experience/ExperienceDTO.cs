using System;

namespace backend.Models {
    public class ExperienceDTO{
        public DateTime Start { get;set;}
        public DateTime Finish { get;set;}
        public String Title { get;set;}
        public String Description { get;set;}
        public ExperienceRole Role { get; set;}

    }
}