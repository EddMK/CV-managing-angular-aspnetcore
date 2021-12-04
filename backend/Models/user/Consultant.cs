using System;

namespace backend.Models {
  public class Consultant : User {
      
    private Manager manager { get; set; }

     public Consultant(string pseudo, string password, string email, string firtsname, string lastname, String title, DateTime birthday, Role role, int userId)

    : base(pseudo, password, email, firtsname, lastname, title, birthday, role, userId){
      
    }

    public Consultant(){ }


  }

}