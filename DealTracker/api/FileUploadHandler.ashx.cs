using DealTracker.Manager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DealTracker.api
{
    /// <summary>
    /// Summary description for FileUploadHandler
    /// </summary>
    public class FileUploadHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            var Requ = context.Request.Params;

            if (context.Request.Params["FilePath"] != null)
            {
                String FolderPath = context.Request.Params["FilePath"].ToString();
                String FilePath = context.Server.MapPath(FolderPath);

                context.Response.ContentType = "text/csv";
                context.Response.TransmitFile(FilePath);
                context.Response.End();
            }

            if (context.Request.Params["Action"] != null)
            {
                string category = context.Request.Params["category"].ToLower();

                if (category.ToLower() == "salesdata")
                {
                    if (context.Request.Files.Count > 0)
                    {
                        var file = context.Request.Files[0];

                        var Result = new UIManager().UploadFile(ref file, context.Server);
                        if (Result != null)
                        {
                            context.Response.StatusCode = 200;
                            context.Response.Output.Write(Result);
                            context.Response.End();
                        }

                    }

                }
            }

        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}