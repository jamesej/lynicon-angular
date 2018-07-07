using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

using Lynicon.Commands;
using Microsoft.AspNetCore.Builder;

namespace LyniconAngular
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = CommandRunner.SetupCommandInterception(CreateWebHostBuilder(args), args);
            builder.Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
            .UseContentRoot(ContentRootLocator.GetContentRoot(args) ?? Directory.GetCurrentDirectory())
                .UseStartup<Startup>();
    }
}
