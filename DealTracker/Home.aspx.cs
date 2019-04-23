using DealTracker.Manager;
using DealTracker.Object;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace DealTracker
{
    public partial class Home : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static string ParseFile(String FilePath)
        {
            return new JavaScriptSerializer().Serialize(new UIManager().GetSalesDataFromFile(FilePath));
        }
    }
}