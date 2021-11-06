using System;
using System.Collections.Generic;

namespace backend.Models {
  public class Manager : User {
      
    private List<Consultant> team  { get; set;}

    public Manager(string pseudo, string password, string email, string firtsname, string lastname, DateTime birthday, UserRole role)

    : base(pseudo, password, email, firtsname, lastname, birthday, role){
      this.team =new List<Consultant>();
    }


  }

}