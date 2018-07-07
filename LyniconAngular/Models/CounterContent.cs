using Lynicon.Attributes;
using Lynicon.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LyniconAngular.Models
{
    public class CounterContent
    {
        [Summary]
        public string Title { get; set; }

        public MinHtml Intro { get; set; } = new MinHtml();

        public int InitialCount { get; set; }
    }
}
