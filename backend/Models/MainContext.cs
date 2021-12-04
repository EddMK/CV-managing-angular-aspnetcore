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


        public MainContext(DbContextOptions<MainContext> options)
            : base(options) {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasIndex(u => u.userId).IsUnique();
            modelBuilder.Entity<Experience>().HasIndex(e => e.IdExperience).IsUnique();

            //modelBuilder.Entity<User>().Property(u => u.userId).ValueGeneratedOnAdd();

            modelBuilder.Entity<Manager>().HasData(
                new Manager {Pseudo = "dan", Password = "dan", Email="danielsoria@gmail.com", FirstName="Daniel", LastName="Soria", Title= "Java developer", BirthDate=new DateTime(1989, 11, 26), Role = Role.MANAGER, userId = 1},
                new Manager {Pseudo = "ed", Password = "ed", Email="edouardkourieh@gmail.com", FirstName="Edouard", LastName="Kourieh" , Title="Php developer",  BirthDate=new DateTime(1995, 1, 2), Role = Role.MANAGER, userId = 2}
            );

            modelBuilder.Entity<Consultant>().HasData(
                new Consultant {Pseudo = "Jo", Password = "jo", Email="joaquim@gmail.com", FirstName="Joaquim", LastName="Munoz", Title="C++ developer" ,BirthDate=new DateTime(1989, 11, 26), Role = Role.CONSULTANT, userId = 3},
                new Consultant {Pseudo = "leo", Password = "leo", Email="leonnie@gmail.com", FirstName="Leonnie", LastName="Bouchat", Title="java developer", BirthDate=new DateTime(1995, 1, 2), Role = Role.CONSULTANT, userId = 4}
            );

            modelBuilder.Entity<Training>().HasData(
                new Training {IdExperience = 1, Start = new DateTime(2022, 02, 1), Finish = new DateTime(2022, 06, 30), Title = "Java Developer",Description ="", Role = ExperienceRole.TRAINING, Grade = Grade.BEGINNER},
                new Training {IdExperience = 2, Start = new DateTime(2021, 02, 1), Finish = new DateTime(2021, 06, 30), Title = ".NET Developer",Description ="", Role = ExperienceRole.TRAINING, Grade = Grade.BEGINNER}
            );

            
        }
        
        
      
    }
}
