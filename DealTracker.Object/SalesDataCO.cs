using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace DealTracker.Object
{
    public class SalesDataCO
    {
        public String DealNumber { get; set; }
         public String CustomerName { get; set; }
        public String DealershipName { get; set; }
        public String Vehicle { get; set; }
        public String Price { get; set; }
        public String Date { get; set; }
        public static SalesDataCO FromCsv(string csvLine)
        {
            string pattern = @"([""'])(?:(?=(\\?))\2.)*?\1";
            csvLine = Regex.Replace(csvLine, pattern, m => m.Value.Replace(",", ""));
            csvLine = csvLine.Replace("\",\"", "");
            csvLine = csvLine.Replace("\"", "");

 
            string[] values = csvLine.Split(',');
            SalesDataCO Row = new SalesDataCO();
            Row.DealNumber = (values[0]);
            Row.CustomerName = (values[1]);
            Row.DealershipName = (values[2]);
            Row.Vehicle = (values[3]);
            Row.Price = (values[4]);
            Row.Date = (values[5]);
            return Row;
        }
    }
}
