using System;

namespace backend.Models {
  public class Consultant : User {
      
    private Manager manager { get; set; }

     public Consultant(string pseudo, string password, string email, string firtsname, string lastname, DateTime birthday, Manager manager, UserRole role)

    : base(pseudo, password, email, firtsname, lastname, birthday, role){
      this.manager = manager;
    }


  }

}