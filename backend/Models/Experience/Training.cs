using System;

namespace backend.Models {
public class Training : Experience {
    public Training(int idexperience, DateTime start, DateTime finish, String title, String description, ExperienceRole role) 
            : base(idexperience,  start,  finish, title,  description){
                this.Role = ExperienceRole.TRAINING;
    }
}
}