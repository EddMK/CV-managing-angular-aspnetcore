using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models {
  public class Consultant : User {
      
     [ForeignKey(nameof(User))]
    public int managerID { get; set; }
    public Manager Manager { get; set; }

     public Consultant(string pseudo, string password, string email, string firtsname, string lastname, String title, DateTime birthday, Role role, int userId, Manager Manager)

    : base(pseudo, password, email, firtsname, lastname, title, birthday, role, userId){
      this.Manager = Manager;
      
    }

    public Consultant(){ }

   


  }

}