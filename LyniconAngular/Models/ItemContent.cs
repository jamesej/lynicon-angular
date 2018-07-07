using Lynicon.Attributes;
using Lynicon.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LyniconAngular.Models
{
    public class ItemSummary : Summary
    { }

    [SummaryType(typeof(ItemSummary))]
    public class ItemContent
    {
        [Summary]
        public string Title { get; set; }

        public MedHtml Body { get; set; } = new MedHtml();
    }
}
