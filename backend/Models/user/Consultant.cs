using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models {
  public class Consultant : User, IValidatableObject {
      
   //[ForeignKey(nameof(User))]
    public int? managerID { get; set; }
    
      
    public Manager Manager { get; set; }

     public Consultant(string password, string email, string firtsname, string lastname, String title, DateTime birthday, Role role, string about, int userId, int managerID)

    : base(password, email, firtsname, lastname, title, birthday, role, about, userId){
      this.Manager = Manager;
      this.managerID = Manager.UserId;
      
    }

    public Consultant(){ }

   


  }

}