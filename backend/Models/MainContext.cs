using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using PRID_Framework;


namespace backend.Models
{
    public class MainContext : DbContext
    {

         public DbSet<User> Users { get; set; }

        public DbSet<Experience> Experience { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Skill> Skills { get; set; }

        public DbSet<Mastering> Masterings { get; set; }

        public DbSet<Using> Usings { get; set; }

        public DbSet<Enterprise> Enterprises {get; set; }

    
        public MainContext(DbContextOptions<MainContext> options)
            : base(options) {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasIndex(u => u.UserId).IsUnique();
            modelBuilder.Entity<Experience>().HasIndex(e => e.IdExperience).IsUnique();
            modelBuilder.Entity<Category>().HasIndex(c => c.categoryId).IsUnique();
            modelBuilder.Entity<Enterprise>().HasIndex(e => e.IdEntreprise).IsUnique();
            modelBuilder.Entity<Enterprise>().HasIndex(e => e.Name);

    
            modelBuilder.Entity<Skill>().HasIndex(s => s.skillId).IsUnique();
            modelBuilder.Entity<Mastering>().HasIndex(m => m.masteringId).IsUnique();
            modelBuilder.Entity<Using>().HasIndex(u => u.Id).IsUnique();
           

            modelBuilder.Entity<Manager>().HasData(
                
                new Manager {Pseudo = "ed", Password = "ed", Email="edouardkourieh@gmail.com", FirstName="Edouard", LastName="Kourieh" , Title="Product manager",  BirthDate=new DateTime(1995, 1, 2), Role = Role.MANAGER, UserId = 2}
            );

            modelBuilder.Entity<Consultant>().HasData(
                new Consultant {Pseudo = "dan", Password = "dan", Email="danielsoria@gmail.com", FirstName="Daniel", LastName="Calatayud Soria", Title= "Java developer", BirthDate=new DateTime(1989, 11, 26), Role = Role.CONSULTANT, UserId =1, managerID = 2},
                new Consultant {Pseudo = "Jo", Password = "jo", Email="joaquim@gmail.com", FirstName="Joaquim", LastName="Munoz", Title="C++ developer" ,BirthDate=new DateTime(1989, 11, 26), Role = Role.CONSULTANT, UserId = 3, managerID = 2},
                new Consultant {Pseudo = "leo", Password = "leo", Email="leonnie@gmail.com", FirstName="Leonnie", LastName="Bouchat", Title="java developer", BirthDate=new DateTime(1995, 1, 2), Role = Role.CONSULTANT, UserId = 4, managerID = 2}
            );

            modelBuilder.Entity<Training>().HasData(
                new Training {IdExperience = 1, UserId = 1,Start = new DateTime(2019, 10, 15), Finish = new DateTime(2022, 06, 30), IdEnterprise = 1, Title = "Bachelore in computer science",Description ="Learning fundamentals of I.T and software development", Role = ExperienceRole.TRAINING, Grade = 90},
                new Training {IdExperience = 2, UserId = 3, Start = new DateTime(2021, 02, 1), Finish = new DateTime(2021, 06, 30), IdEnterprise = 1, Title = "Bachelore in computer science",Description ="", Role = ExperienceRole.TRAINING, Grade = 77}
            );

            modelBuilder.Entity<Mission>().HasData(
                new Mission { IdExperience = 3, UserId = 1,Start = new DateTime(2021, 10, 1), Finish = new DateTime(2024, 10, 1), IdEnterprise = 2, Title = "Java fullstack developer",Description ="Programming software for a specific justice departement ", Role = ExperienceRole.MISSION}
            );

            modelBuilder.Entity<Enterprise>().HasData(
               new Enterprise { IdEntreprise = 1, Name = "Epfc"},
               new Enterprise { IdEntreprise = 2, Name = "SPF justice - FOD justicie"}
            );

            modelBuilder.Entity<Using>().HasData(
               new Using {Id =1, ExperienceId = 1, SkillId = 1},
               new Using {Id =2, ExperienceId = 1, SkillId = 2},
               new Using {Id =3, ExperienceId = 1, SkillId = 3},
               new Using {Id =4,ExperienceId = 1, SkillId = 4},
               new Using {Id =5,ExperienceId = 1, SkillId = 5},
               new Using {Id =6,ExperienceId = 1, SkillId = 6},
               new Using {Id =7, ExperienceId = 1, SkillId = 7}
            );
 
            modelBuilder.Entity<Category>().HasData(
                new Category {categoryId = 1,  Name = "Language"},
                new Category { categoryId = 2,  Name = "Database"},
                new Category { categoryId = 3,  Name = "Framework"}
              
            );

            modelBuilder.Entity<Skill>().HasData(
                // linked to languages
                new Skill { skillId = 1, Name = "Java", categoryId = 1},
                new Skill { skillId = 2, Name = "C#", categoryId = 1},
                new Skill { skillId = 3, Name = "C++", categoryId = 1},
                new Skill { skillId = 4, Name = "Python", categoryId = 1},
                new Skill { skillId = 5, Name = "Typescript", categoryId = 1},
                // linked to databases 
                new Skill { skillId = 6, Name = "Oracle", categoryId = 2},
                new Skill { skillId = 7, Name = "MySQL", categoryId = 2},
                new Skill { skillId = 8, Name = "MongoDB", categoryId = 2},
                new Skill { skillId = 9, Name = "MariaDB", categoryId = 2},
                new Skill { skillId = 10, Name = "SqlLite", categoryId = 2},

                // linked to frameworks 
                
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
               new Mastering { masteringId=11, userId=1, SkillId=14,  Level = Level.Intermediate}


            );




            
            
        }

   

      
      
        
      
    }
}
