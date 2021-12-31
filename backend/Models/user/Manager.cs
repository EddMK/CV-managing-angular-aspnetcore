using System;
using System.Collections.Generic;

namespace backend.Models {
  public class Manager : User{
      
       
    public ICollection<Consultant> consultants { get; set; } = new HashSet<Consultant>();

    public Manager(string password, string email, string firtsname, string lastname, string title, DateTime birthday, Role role, string about,int userId)

    : base(password, email, firtsname, lastname, title, birthday, role, about, userId){
    
    }

    public Manager(){
      
    }
    

  }

}