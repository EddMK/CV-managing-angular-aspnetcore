using System;

namespace backend.Models {
  public class Consultant : User {
      
    private Manager manager { get; set; }

     public Consultant(string pseudo, string password, string email, string firtsname, string lastname, DateTime birthday, UserRole role, int userId)

    : base(pseudo, password, email, firtsname, lastname, birthday, role, userId){
      
    }

    public Consultant(){ }


  }

}