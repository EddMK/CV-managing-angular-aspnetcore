using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using PRID_Framework;


namespace backend.Models
{
    public class MainContext : DbContext
    {

        public DbSet<User> Users { get; set; }

        public DbSet<Consultant> Consultants { get; set; }


        public DbSet<Manager> Managers { get; set; }


        public DbSet<Experience> Experience { get; set; }

        public DbSet<Mission> Missions { get; set; }

        public DbSet<Training> Trainings { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Skill> Skills { get; set; }

        public DbSet<Mastering> Masterings { get; set; }

        public DbSet<Using> Usings { get; set; }

        public DbSet<Enterprise> Enterprises {get; set; }

        public String about1 = "A few years ago I decided to do a complete switch and left my job as a tram driver to pursue a bachelor degree in computer science. "+
           "I see programming as a virtual lego game where you can build whatever your imagination allows you to." ;

    
        public MainContext(DbContextOptions<MainContext> options)
            : base(options) {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
               .HasIndex(u => u.UserId).IsUnique();

    
            modelBuilder.Entity<Experience>().HasIndex(e => e.IdExperience).IsUnique();
            modelBuilder.Entity<Category>().HasIndex(c => c.categoryId).IsUnique();
            modelBuilder.Entity<Enterprise>().HasIndex(e => e.IdEnterprise).IsUnique();
            modelBuilder.Entity<Enterprise>().HasIndex(e => e.Name);
            modelBuilder.Entity<Enterprise>().HasIndex(e => e.role);

    
            modelBuilder.Entity<Skill>().HasIndex(s => s.skillId).IsUnique();
            modelBuilder.Entity<Mastering>().HasIndex(m => m.masteringId).IsUnique();
            modelBuilder.Entity<Using>().HasIndex(u => u.Id).IsUnique();
           

            modelBuilder.Entity<Manager>().HasData(
                
                new Manager {Password = "ed", Email="edouardkourieh@gmail.com", FirstName="Edouard", LastName="Kourieh" , Title="Product manager",  BirthDate=new DateTime(1995, 1, 2), Role = Role.MANAGER, About="",UserId = 2},
                new Manager {Password = "gil", Email="gilfoy@gmail.com", FirstName="Betram", LastName="Gilfoy" , Title=" Technical manager",  BirthDate=new DateTime(1985, 7, 8), Role = Role.MANAGER,About="", UserId = 7}
            );

            modelBuilder.Entity<Consultant>().HasData( 
                new Consultant {Password = "dan", Email="danielsoria@gmail.com", FirstName="Daniel", LastName="Calatayud Soria", Title= "Java developer", BirthDate=new DateTime(1989, 11, 26), Role = Role.CONSULTANT, About = about1 , UserId =1, managerID = 7},
                new Consultant {Password = "li", Email="linh@gmail.com", FirstName="Linh", LastName="Nguyen", Title="java developer" ,BirthDate=new DateTime(1996, 2, 26), Role = Role.CONSULTANT,About="", UserId = 3, managerID = 7},
                new Consultant {Password = "alex", Email="alexei@gmail.com", FirstName="Alexei", LastName="Revenko", Title="java developer", BirthDate=new DateTime(1999, 1, 2), Role = Role.CONSULTANT,About="",UserId = 4, managerID = 7},
                new Consultant {Password = "jen", Email="jen@gmail.com", FirstName="jen", LastName="Kins", Title="python developer", BirthDate=new DateTime(1995, 1, 2), Role = Role.CONSULTANT,About="",UserId = 5}
            );

            modelBuilder.Entity<Training>().HasData(
                new Training {IdExperience = 1, UserId = 1,Start = new DateTime(2019, 10, 15), Finish = null , IdEnterprise = 1, Title = "Bachelore in computer science",Description ="Learning fundamentals of I.T and software development", Role = ExperienceRole.TRAINING, Grade = 90},
                new Training {IdExperience = 2, UserId = 3,Start = new DateTime(2019, 10, 15), Finish = null , IdEnterprise = 1, Title = "Bachelore in computer science",Description ="Learning fundamentals of I.T and software development", Role = ExperienceRole.TRAINING, Grade = 90},
                new Training {IdExperience = 4, UserId = 5,Start = new DateTime(2016, 10, 15), Finish = new DateTime(2019, 06, 30) , IdEnterprise = 3, Title = "Bachelor in Physics",Description ="", Role = ExperienceRole.TRAINING, Grade = 80},
                new Training {IdExperience = 5, UserId = 5,Start = new DateTime(2013, 10, 15), Finish = new DateTime(2016, 06, 30) , IdEnterprise = 3, Title = "Bachelore in law",Description ="", Role = ExperienceRole.TRAINING, Grade = 90},
                new Training {IdExperience = 6, UserId = 2, Start = new DateTime(2021, 02, 1), Finish = null, IdEnterprise = 1, Title = "Web Training",Description ="", Role = ExperienceRole.TRAINING, Grade = 77},
                new Training {IdExperience = 7, UserId = 7, Start = new DateTime(2010, 02, 1), Finish = new DateTime(2013, 06, 30), IdEnterprise = 3, Title = "Bachelore in computer science",Description ="Learning fundamentals of I.T and software development", Role = ExperienceRole.TRAINING, Grade = 95},
                new Training {IdExperience = 8, UserId = 2, Start = new DateTime(2015, 9, 1), Finish = new DateTime(2020, 06, 30), IdEnterprise = 3, Title = "Master in engineer",Description ="Learning the lights", Role = ExperienceRole.TRAINING, Grade = 70},
                new Training {IdExperience = 12, UserId = 4, Start = new DateTime(2019, 9, 1), Finish = new DateTime(2021, 06, 30), IdEnterprise = 1, Title = "Bachelor in accounting",Description ="Learning economics", Role = ExperienceRole.TRAINING, Grade = 99}
            );

            modelBuilder.Entity<Mission>().HasData(
                new Mission { IdExperience = 3, UserId = 1,Start = new DateTime(2021, 10, 1), Finish = new DateTime(2024, 10, 1), IdEnterprise = 4,  Title = "Java fullstack developer",Description ="Programming software for a specific justice departement ", Role = ExperienceRole.MISSION, clientIdEnterprise = 2},
                new Mission {IdExperience = 9, UserId = 2, Start = new DateTime(2022, 9, 1), Finish = null, IdEnterprise = 5, Title = "ERP for school",Description ="Create software for schools", Role = ExperienceRole.MISSION, clientIdEnterprise = 1},
                new Mission { IdExperience = 10, UserId = 3,Start = new DateTime(2021, 10, 1), Finish = new DateTime(2024, 10, 1), IdEnterprise = 4,  Title = "Java fullstack developer",Description ="Programming software for a specific justice departement ", Role = ExperienceRole.MISSION, clientIdEnterprise = 2}
              
            );

            modelBuilder.Entity<Enterprise>().HasData(
               new Enterprise { IdEnterprise = 1, Name = "Epfc", role = EnterPriseRole.EMPLOYER},
               new Enterprise { IdEnterprise = 2, Name = "SPF justice - FOD justicie", role = EnterPriseRole.CLIENT},
               new Enterprise { IdEnterprise = 3, Name = "Stanford",role= EnterPriseRole.EMPLOYER},
               new Enterprise { IdEnterprise = 4, Name = "Egov select", role = EnterPriseRole.EMPLOYER},
               new Enterprise { IdEnterprise = 5, Name = "Odoo", role = EnterPriseRole.CLIENT}
            );

            modelBuilder.Entity<Using>().HasData(

               // for epfc 
               new Using {Id =1, ExperienceId = 1, SkillId = 1},
               new Using {Id =2, ExperienceId = 1, SkillId = 2},
               new Using {Id =3, ExperienceId = 1, SkillId = 3},
               new Using {Id =4,ExperienceId = 1, SkillId = 4},
               new Using {Id =5,ExperienceId = 1, SkillId = 5},
               new Using {Id =6,ExperienceId = 1, SkillId = 6},
               new Using {Id =7, ExperienceId = 1, SkillId = 7},
               new Using {Id =8,ExperienceId = 1, SkillId = 11},
               new Using {Id =9,ExperienceId = 1, SkillId = 12},
               new Using {Id =10,ExperienceId = 1, SkillId = 13},
               new Using {Id =11, ExperienceId = 1, SkillId = 14},

               // for stanford

                 
               new Using {Id =12, ExperienceId = 4, SkillId = 2},
               new Using {Id =13, ExperienceId = 4, SkillId = 3},
               new Using {Id =14,ExperienceId = 4, SkillId = 4},
               new Using {Id =15,ExperienceId = 4, SkillId = 5},
               new Using {Id =16,ExperienceId = 4, SkillId = 6},
               new Using {Id =17, ExperienceId =4, SkillId = 7},
               new Using {Id =18,ExperienceId = 4, SkillId = 11},
               new Using {Id =19,ExperienceId = 4, SkillId = 12},
               new Using {Id =20,ExperienceId = 4, SkillId = 13},
               new Using {Id =21, ExperienceId = 4, SkillId = 14},

               
                //for Edouard
               new Using {Id =22, ExperienceId =8, SkillId = 4},
               new Using {Id =23,ExperienceId = 8, SkillId = 7},
               new Using {Id =24,ExperienceId = 8, SkillId = 9},
               new Using {Id =25,ExperienceId = 9, SkillId = 5},
               new Using {Id =26, ExperienceId = 9, SkillId = 12}
            );
 
            modelBuilder.Entity<Category>().HasData(
                new Category {categoryId = 1,  Name = "Language"},
                new Category { categoryId = 2,  Name = "Database"},
                new Category { categoryId = 3,  Name = "Framework"}
              
            );

            modelBuilder.Entity<Skill>().HasData(
                // linked to languages
                new Skill { skillId = 1, Name = "Java", categoryId = 1},
                new Skill { skillId = 2, Name = "C sharp", categoryId = 1},
                new Skill { skillId = 3, Name = "C++", categoryId = 1},
                new Skill { skillId = 4, Name = "Python", categoryId = 1},
                new Skill { skillId = 5, Name = "Typescript", categoryId = 1},
                // linked to databases 
                new Skill { skillId = 6, Name = "Oracle", categoryId = 2},
                new Skill { skillId = 7, Name = "MySQL", categoryId = 2},
                new Skill { skillId = 8, Name = "MongoDB", categoryId = 2},
                new Skill { skillId = 9, Name = "MariaDB", categoryId = 2},
                new Skill { skillId = 10, Name = "SqlLite", categoryId = 2},
                // linked to frameworks s
                new Skill { skillId = 11, Name = "Spring Boot", categoryId = 3},
                new Skill { skillId = 12, Name = "Asp.net core", categoryId = 3},
                new Skill { skillId = 13, Name = "Xaml", categoryId = 3},
                new Skill { skillId = 14, Name = "Java FX", categoryId = 3},
                new Skill { skillId = 15, Name = "Java EE", categoryId = 3}  
            );

           modelBuilder.Entity<Mastering>().HasData(
               // for dan
               new Mastering { masteringId=1, userId=1, SkillId=1,  Level = Level.Advanced},
               new Mastering { masteringId=2, userId=1, SkillId=2,  Level = Level.Intermediate},
               new Mastering { masteringId=3, userId=1, SkillId=3,  Level = Level.Intermediate},
               new Mastering { masteringId=4, userId=1, SkillId=4,  Level = Level.Beginner},
               new Mastering { masteringId=5, userId=1, SkillId=5,  Level = Level.Advanced},
               new Mastering { masteringId=6, userId=1, SkillId=6,  Level = Level.Advanced},
               new Mastering { masteringId=7, userId=1, SkillId=10,  Level = Level.Intermediate},
               new Mastering { masteringId=8, userId=1, SkillId=11,  Level = Level.Advanced},
               new Mastering { masteringId=9, userId=1, SkillId=12,  Level = Level.Beginner},
               new Mastering { masteringId=10, userId=1, SkillId=13,  Level = Level.Advanced},
               new Mastering { masteringId=11, userId=1, SkillId=14,  Level = Level.Intermediate},

               // for gilfoy

               new Mastering { masteringId=12, userId=7, SkillId=1,  Level = Level.Advanced},
               new Mastering { masteringId=13, userId=7, SkillId=2,  Level = Level.Intermediate},
               new Mastering { masteringId=14, userId=7, SkillId=3,  Level = Level.Intermediate},
               new Mastering { masteringId=15, userId=7, SkillId=4,  Level = Level.Beginner},
               new Mastering { masteringId=16, userId=7, SkillId=5,  Level = Level.Advanced},
               new Mastering { masteringId=17, userId=7, SkillId=6,  Level = Level.Advanced},
               new Mastering { masteringId=18, userId=7, SkillId=10,  Level = Level.Intermediate},
               new Mastering { masteringId=19, userId=7, SkillId=11,  Level = Level.Advanced},
               new Mastering { masteringId=20, userId=7, SkillId=12,  Level = Level.Beginner},
               new Mastering { masteringId=21, userId=7, SkillId=13,  Level = Level.Advanced},
               new Mastering { masteringId=22, userId=7, SkillId=14,  Level = Level.Intermediate},

                //for edouard
                new Mastering { masteringId=23, userId=2, SkillId=5,  Level = Level.Intermediate},
               new Mastering { masteringId=24, userId=2, SkillId=7,  Level = Level.Beginner},
               new Mastering { masteringId=25, userId=2, SkillId=9,  Level = Level.Advanced},
               new Mastering { masteringId=26, userId=2, SkillId=12,  Level = Level.Intermediate}

            );

          // strings for the abouts
            
           


    

            
            
        }

   

      
      
        
      
    }
}
