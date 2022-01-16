using System;

namespace backend.Models {
    public class Mission : Experience {

        public Enterprise client { get; set; }

        public int? clientIdEnterprise { get; set; }

       public Mission(User user, DateTime start, DateTime finish, string title, string description, ExperienceRole role, Enterprise enterprise, Enterprise client, int id, double grade)  
       : base(user, start, finish, title, description, role, enterprise,id) {
          this.client = client;
       }

       public Mission(){
           
       }


    }
}