using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using backend.Models;
using AutoMapper;
using AutoMapper.EquivalencyExpression;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;



namespace backend
{

    public class DateTimeConverter : JsonConverter<DateTime>
    {
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if(reader.GetString() == null){
                string s = "0001-1-1";
                return DateTime.Parse(s);
            }
            return DateTime.Parse(reader.GetString());
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            int result = DateTime.Compare(value, new DateTime());
            //Console.WriteLine("RESULT : "+result);
            if(result == 0){
                writer.WriteStringValue("");
            }else{
                writer.WriteStringValue(value.ToUniversalTime().ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ssZ"));
            }
        }
    }

    public class Startup
    {
        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services) {
            services.AddDbContext<MainContext>(opt => opt.UseSqlite("data source=prid-2122-g04.db"));
            services.AddControllers();
            services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new DateTimeConverter());
            });
            
          // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration => {
                configuration.RootPath = "wwwroot/frontend";
            });
           
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
        
         //------------------------------ 
            // configure jwt authentication 
            //------------------------------ 

            // Notre clé secrète pour les jetons sur le back-end 
            var key = Encoding.ASCII.GetBytes("my-super-secret-key");
            // On précise qu'on veut travaille avec JWT tant pour l'authentification  
            // que pour la vérification de l'authentification 
            services.AddAuthentication(x => {
                    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(x => {
                    // On exige des requêtes sécurisées avec HTTPS 
                    x.RequireHttpsMetadata = true;
                    x.SaveToken = true;
                    // On précise comment un jeton reçu doit être validé 
                    x.TokenValidationParameters = new TokenValidationParameters {
                        // On vérifie qu'il a bien été signé avec la clé définie ci-dessous 
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        // On ne vérifie pas l'identité de l'émetteur du jeton 
                        ValidateIssuer = false,
                        // On ne vérifie pas non plus l'identité du destinataire du jeton 
                        ValidateAudience = false,
                        // Par contre, on vérifie la validité temporelle du jeton 
                        ValidateLifetime = true,
                        // On précise qu'on n'applique aucune tolérance de validité temporelle 
                        ClockSkew = TimeSpan.Zero  //the default for this setting is 5 minutes 
                    };
                    // On peut définir des événements liés à l'utilisation des jetons 
                    x.Events = new JwtBearerEvents {
                        // Si l'authentification du jeton est rejetée ... 
                        OnAuthenticationFailed = context => {
                            // ... parce que le jeton est expiré ... 
                            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException)) {
                                // ... on ajoute un header à destination du front-end indiquant cette expiration 
                                context.Response.Headers.Add("Token-Expired", "true");
                            }
                            return Task.CompletedTask;
                        }
                    };
                });
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

            app.UseDefaultFiles();
            
            app.UseStaticFiles();
            if (!env.IsDevelopment()) {
                app.UseSpaStaticFiles();
            }

             app.UseAuthentication();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => {
                endpoints.MapControllers();
            });

            app.UseSpa(spa => {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501
                spa.Options.SourcePath = "prid2122-g04\frontend";
                if (env.IsDevelopment()) {
                    //spa.UseAngularCliServer(npmScript: "start");
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }
            });
          
        }
    }
}
