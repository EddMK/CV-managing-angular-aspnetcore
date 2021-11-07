using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace backend.Models
{
    public class MainContext : DbContext
    {
        public MainContext(DbContextOptions<MainContext> options)
            : base(options) {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasIndex(u => u.userId).IsUnique(); 
            //modelBuilder.Entity<User>().Property(u => u.userId).ValueGeneratedOnAdd();

            modelBuilder.Entity<User>().HasData(
                new User {userId = 1, Pseudo = "benoit", Password = "benoit", Email="bpenelle@gmail.com", FirstName="Benoit", LastName="Pennelle", BirthDate=new DateTime(1970, 1, 2), Role = UserRole.MANAGER},
                new User {userId = 2, Pseudo = "bruno", Password = "bruno", Email="blacroix@gmail.com", FirstName="Bruno", LastName="Lacroix" , BirthDate=new DateTime(1970, 1, 2), Role = UserRole.MANAGER }
                
            );
        }

        public DbSet<User> Users { get; set; }
    }
}
