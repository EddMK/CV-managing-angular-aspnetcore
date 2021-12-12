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

      


        public MainContext(DbContextOptions<MainContext> options)
            : base(options) {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasIndex(u => u.userId).IsUnique();
            modelBuilder.Entity<Experience>().HasIndex(e => e.IdExperience).IsUnique();
            modelBuilder.Entity<Category>().HasIndex(c => c.categoryId).IsUnique();
    
            modelBuilder.Entity<Skill>().HasIndex(s => s.skillId).IsUnique();
            modelBuilder.Entity<Mastering>().HasIndex(m => m.masteringId).IsUnique();


            modelBuilder.Entity<Manager>().HasData(
                new Manager {Pseudo = "dan", Password = "dan", Email="danielsoria@gmail.com", FirstName="Daniel", LastName="Calatayud Soria", Title= "Java developer", BirthDate=new DateTime(1989, 11, 26), Role = Role.CONSULTANT, userId = 1},
                new Manager {Pseudo = "ed", Password = "ed", Email="edouardkourieh@gmail.com", FirstName="Edouard", LastName="Kourieh" , Title="Product manager",  BirthDate=new DateTime(1995, 1, 2), Role = Role.MANAGER, userId = 2}
            );

            modelBuilder.Entity<Consultant>().HasData(
                new Consultant {Pseudo = "Jo", Password = "jo", Email="joaquim@gmail.com", FirstName="Joaquim", LastName="Munoz", Title="C++ developer" ,BirthDate=new DateTime(1989, 11, 26), Role = Role.CONSULTANT, userId = 3},
                new Consultant {Pseudo = "leo", Password = "leo", Email="leonnie@gmail.com", FirstName="Leonnie", LastName="Bouchat", Title="java developer", BirthDate=new DateTime(1995, 1, 2), Role = Role.CONSULTANT, userId = 4}
            );

            modelBuilder.Entity<Training>().HasData(
                new Training {IdExperience = 1, Start = new DateTime(2022, 02, 1), Finish = new DateTime(2022, 06, 30), Title = "Bachelore in computer science",Description ="", Role = ExperienceRole.TRAINING, Grade = 90},
                new Training {IdExperience = 2, Start = new DateTime(2021, 02, 1), Finish = new DateTime(2021, 06, 30), Title = "Bachelore in computer science",Description ="", Role = ExperienceRole.TRAINING, Grade = 77}
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
                new Skill { skillId = 10, Name = "SqlLite", categoryId = 2}
            );

           modelBuilder.Entity<Mastering>().HasData(
               // for dan
               new Mastering { masteringId=1, userId=1, SkillId=1,  Level = Level.Advanced},
               new Mastering { masteringId=2, userId=1, SkillId=2,  Level = Level.Intermediate},
               new Mastering { masteringId=3, userId=1, SkillId=3,  Level = Level.Intermediate},
               new Mastering { masteringId=4, userId=1, SkillId=4,  Level = Level.Beginner},
               new Mastering { masteringId=5, userId=1, SkillId=5,  Level = Level.Advanced},
               new Mastering { masteringId=6, userId=1, SkillId=6,  Level = Level.Advanced},
               new Mastering { masteringId=7, userId=1, SkillId=10,  Level = Level.Intermediate}





               
            );




            
            
        }

   

      
      
        
      
    }
}
