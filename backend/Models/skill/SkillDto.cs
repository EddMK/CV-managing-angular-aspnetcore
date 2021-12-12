 

namespace backend.Models {

   public class SkillDto {
 
   public int skillId { get; set;}
   
   public string Name {get; set; }


   public int categoryId { get; set; }

     public CategoryDto category { get; set;}

   }

}