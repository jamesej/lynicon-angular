using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using System.Reflection;
using Lynicon.Logging;
using Lynicon.Membership;
using Lynicon.Modules;
using Lynicon.Routing;
using Lynicon.Services;
using Lynicon.Startup;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Lynicon.Extra.Modules;
using Lynicon.Editors;
using LyniconAngular.Models;
using System.Collections.Generic;

namespace LyniconAngular
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            Configuration = configuration;
            env.ConfigureLog4Net("log4net.xml");
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc(options => options.AddLyniconOptions()).AddApplicationPart(typeof(LyniconSystem).GetTypeInfo().Assembly).SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
            services.AddIdentity<User, IdentityRole>()
            	.AddDefaultTokenProviders();
            	
            services.AddAuthorization(options => options.AddLyniconAuthorization());
            	
            services.AddLynicon(options =>
            	options.UseConfiguration(Configuration.GetSection("Lynicon:Core"))
            		.UseModule<CoreModule>()
                    .UseModule<Storeless>(Configuration.GetSection("Lynicon:Storeless:Cache")))
                .AddLyniconIdentity()
                .SetDiverter(new SpaDataDiverter());
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IApplicationLifetime life)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseAuthentication();

            app.ConstructLynicon();
            app.UseMvc(routes =>
            {
                routes.MapLyniconRoutes();
                routes.MapDataRoute<HomeContent>("home", "");
                routes.MapDataRoute<CounterContent>("counter", "counter");
                routes.MapDataRoute<ItemContent>("items", "item/{_0}");
                routes.MapDataRoute<List<ItemSummary>>("item-list", "items");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
            
            app.InitialiseLynicon(life);
        }
    }
}
