using System;
using System.Collections.Generic;

namespace backend.Models {
  public class Manager : User {
      
    private List<Consultant> team  { get; set;} = new List<Consultant>();


  }

}