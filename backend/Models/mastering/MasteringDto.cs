

namespace backend.Models {

   public class MasteringDto {

    public int masteringId {get; set; }
    public int UserId { get; set; }
 
    public int SkillId { get; set; } 
   public SkillDto Skill { get; set; }
    public int Level { get; set; }


    }

}