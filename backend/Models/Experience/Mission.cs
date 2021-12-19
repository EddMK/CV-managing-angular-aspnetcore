using System;

namespace backend.Models {
    public class Mission : Experience {

       public Mission(User user, DateTime start, DateTime finish, string title, string description, ExperienceRole role, Enterprise enterprise, int id, double grade)  
       : base(user, start, finish, title, description, role, enterprise, id) {
     
       }

       public Mission(){
           
       }


    }
}