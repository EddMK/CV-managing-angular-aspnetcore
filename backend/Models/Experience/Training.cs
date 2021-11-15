using System;
using static System.Collections.IEnumerable;

namespace backend.Models {

    public enum Grade {
        BEGINNER = 0, INTERMEDIATE = 1, ADVANCED = 2
    }
    public class Training : Experience {
        public Grade Grade { get; set;}
    }
}