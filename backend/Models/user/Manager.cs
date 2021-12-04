using System;
using System.Collections.Generic;

namespace backend.Models {
  public class Manager : User {
      
    private List<Consultant> team  { get; set;}

    public Manager(string pseudo, string password, string email, string firtsname, string lastname, string title, DateTime birthday, Role role, int userId)

    : base(pseudo, password, email, firtsname, lastname, title, birthday, role, userId){
      this.team =new List<Consultant>();
    }

    public Manager(){
      
    }
    

  }

}