using AutoMapper;

namespace backend.Models
{
    /*
    Cette classe sert à configurer AutoMapper pour lui indiquer quels sont les mappings possibles
    et, le cas échéant, paramétrer ces mappings de manière déclarative (nous verrons des exemples plus tard).
    */
    public class MappingProfile : Profile
    {
        private MainContext _context;

        /*
        Le gestionnaire de dépendance injecte une instance du contexte EF dont le mapper peut
        se servir en cas de besoin (ce n'est pas encore le cas).
        */
        public MappingProfile(MainContext context) {
            _context = context;

            CreateMap<User, UserDTO>(); // Include<Consultant, UserDTO>().Include<Manager, UserDTO>(); 
            CreateMap<UserDTO, User>();
            CreateMap<UserDTO, Consultant>();
           CreateMap<Consultant, UserDTO>().ForMember(o => o.Manager, m => m.MapFrom(x => x.Manager));
         
            CreateMap<Manager, UserDTO>().ForMember(o => o.consultants, m => m.MapFrom(x => x.consultants));

            CreateMap<User, UserWithPasswordDTO>();
            CreateMap<UserWithPasswordDTO, User>();
            CreateMap<UserWithPasswordDTO, Consultant>();


            CreateMap<Category, CategoryDto>();
            CreateMap<CategoryDto, Category>();

            CreateMap<Skill, SkillDto>();
            CreateMap<SkillDto, Skill>();

            CreateMap<Mastering, MasteringDto>();
            CreateMap<MasteringDto, Mastering>();
            
            CreateMap<Experience,ExperienceDTO>().Include<Training, ExperienceDTO>(); 
            CreateMap<Training, ExperienceDTO>().ForMember(o => o.Grade, m => m.MapFrom(x => x.Grade));
            CreateMap<ExperienceDTO,Experience>();
          

            CreateMap<Enterprise, EnterpriseDto>();
            CreateMap<EnterpriseDto, Enterprise>();

            CreateMap<Using, UsingDto>();
            CreateMap<UsingDto, Using>();

           

           
        }
    }
}
