using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models {
  public class Consultant : User, IValidatableObject {
      
     [ForeignKey(nameof(Manager))]
    public int managerID { get; set; }
    
    public Manager Manager { get; set; }

     public Consultant(string pseudo, string password, string email, string firtsname, string lastname, String title, DateTime birthday, Role role, int userId, int managerID)

    : base(pseudo, password, email, firtsname, lastname, title, birthday, role, userId){
      this.Manager = Manager;
      this.managerID = Manager.UserId;
      
    }

    public Consultant(){ }

   


  }

}