using System;

namespace backend.Models {
public class Mission : Experience {
    public Mission(DateTime start, DateTime finish, String title, String description, ExperienceRole role, int idexperience) 
            : base( start,  finish, title,  description, role, idexperience){
    }
}
}