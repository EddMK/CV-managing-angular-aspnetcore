using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
//using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using backend.Models;
using AutoMapper;
using AutoMapper.EquivalencyExpression;

namespace backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services) {
            services.AddDbContext<MainContext>(opt => opt.UseSqlite("data source=prid-2122-g04"));
            services.AddControllers();
           
            services.AddSwaggerGen(c => {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "prid-2122-g04", Version = "v1" });
            });
            // Auto Mapper Configurations
            services.AddScoped(provider => new MapperConfiguration(cfg => {
            cfg.AddProfile(new MappingProfile(provider.GetService<MainContext>()));
           // see: https://github.com/AutoMapper/AutoMapper.Collection
          cfg.AddCollectionMappers();
           cfg.UseEntityFrameworkCoreModel<MainContext>(services);
    }).CreateMapper());
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, MainContext context) {
            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "prid-2122-g04"));
            }

            if (context.Database.IsSqlite())
                /*
                La suppression complète de la base de données n'est pas possible si celle-ci est ouverte par un autre programme,
                comme par exemple "DB Browser for SQLite" car les fichiers correspondants sont verrouillés.
                Pour contourner ce problème, on exécute cet ensemble de commandes qui vont supprimer tout le contenu de la DB.
                La dernière commande permet de réduire la taille du fichier au minimum.
                (voir https://stackoverflow.com/a/548297)
                */
                context.Database.ExecuteSqlRaw(
                    @"PRAGMA writable_schema = 1;
                    delete from sqlite_master where type in ('table', 'index', 'trigger', 'view');
                    PRAGMA writable_schema = 0;
                    VACUUM;");
            else
                context.Database.EnsureDeleted();
            context.Database.EnsureCreated();


            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => {
                endpoints.MapControllers();
            });
          
        }
    }
}
