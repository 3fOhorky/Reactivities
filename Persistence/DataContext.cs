using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Value> Values { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> Followings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Value>()
                .HasData(
                    new Value { Id = 1, Name = "Value 101" },
                    new Value { Id = 2, Name = "Value 102" },
                    new Value { Id = 3, Name = "Value 103" }
                );

            // kompozitni ključ UserActivities tablice
            modelBuilder.Entity<UserActivity>(x => x.HasKey(ua => new { ua.AppUserID, ua.AcitivityId }));

            // UserActivities je vezna tablica many to many relacije između Activities i AppUser tablica
            modelBuilder.Entity<UserActivity>().HasOne(u => u.AppUser).WithMany(a => a.UserActivities).HasForeignKey(u => u.AppUserID);
            modelBuilder.Entity<UserActivity>().HasOne(a => a.Activity).WithMany(u => u.UserActivities).HasForeignKey(a => a.AcitivityId);

            // Followings je self referencing many to many vezna tablica
            modelBuilder.Entity<UserFollowing>(x => x.HasKey(uf => new { uf.TargetId, uf.ObserverId }));
            modelBuilder.Entity<UserFollowing>().HasOne(u => u.Observer).WithMany(a => a.Followings).HasForeignKey(u => u.ObserverId);
            modelBuilder.Entity<UserFollowing>().HasOne(u => u.Target).WithMany(a => a.Followers).HasForeignKey(u => u.TargetId);
        }
    }
}