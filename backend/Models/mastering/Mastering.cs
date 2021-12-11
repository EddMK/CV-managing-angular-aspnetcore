
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models {

  public enum Level {
    Beginner, Intermediate, Advanced, Expert
  }

  public class Mastering {
   
   [Key]
   public int masteringId { get; set; }
   
   [Required]
   public Level Level { get; set; }
   
   [Required]
   public Skill Skill { get; set; }

   [Required]
   public User User { get; set; }





      

  }

}
