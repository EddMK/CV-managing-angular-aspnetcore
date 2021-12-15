using System;
using static System.Collections.IEnumerable;

namespace backend.Models {

    public class Training : Experience {
       
       public double Grade { get; set;}

       public Training(User user, DateTime start, DateTime finish, string title, string description, ExperienceRole role, Enterprise enterprise, int id, double grade)  
       : base(user, start, finish, title, description, role, enterprise, id) {
         this.Grade = grade;
       }
        
        public Training(){}
    
    }
}