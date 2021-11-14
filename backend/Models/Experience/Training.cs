using System;
using static System.Collections.IEnumerable;

namespace backend.Models {
    public class Training : Experience {
        public Training(DateTime start, DateTime finish, String title, String description, ExperienceRole role, int idexperience) 
                : base( start,  finish, title,  description, role, idexperience){
        }
    }
}