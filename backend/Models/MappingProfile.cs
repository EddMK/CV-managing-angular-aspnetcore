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

            CreateMap<User, UserDTO>();
            CreateMap<UserDTO, User>();

            CreateMap<User, UserWithPasswordDTO>();
            CreateMap<UserWithPasswordDTO, User>();

            CreateMap<Experience,ExperienceDTO>();
            CreateMap<ExperienceDTO,Experience>();

            CreateMap<Category, CategoryDto>();
            CreateMap<CategoryDto, Category>();

            CreateMap<Skill, SkillDto>();
            CreateMap<SkillDto, Skill>();

            CreateMap<Mastering, MasteringDto>();
            CreateMap<MasteringDto, Mastering>();

           

           
        }
    }
}
