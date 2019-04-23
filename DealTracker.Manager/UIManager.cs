using DealTracker.Object;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;

namespace DealTracker.Manager
{
    public class UIManager
    {
        private string GetConfig(string Key)
        {
            return WebConfigurationManager.AppSettings[Key];
        }

        public List<SalesDataCO> GetSalesDataFromFile(String FilePath)
        {
            String FolderPath = GetConfig("FilesUploadedPath").ToString();
            if (File.Exists(HttpContext.Current.Server.MapPath(FolderPath+FilePath)))
            {

                var Result = File.ReadAllLines(HttpContext.Current.Server.MapPath(FolderPath + FilePath));
                foreach(var item in Result)
                {
                   
                }

                List<SalesDataCO> values = File.ReadAllLines(HttpContext.Current.Server.MapPath(FolderPath+FilePath))
                                               .Skip(1)
                                               .Select(v => SalesDataCO.FromCsv(v))
                                               .ToList();

                return values;
            }
            return null;
        }
        public string UploadFile(ref HttpPostedFile FileUploaded, HttpServerUtility context)
        {
            String FileName = Path.GetFileName(FileUploaded.FileName);
            String Extension = Path.GetExtension(FileUploaded.FileName);
            String FolderPath = GetConfig("FilesUploadedPath").ToString();
            if (!Directory.Exists(context.MapPath(FolderPath)))
            {
                System.IO.Directory.CreateDirectory(context.MapPath(FolderPath));
            }
            if (context != null)
            {
                String FilePath = context.MapPath(FolderPath + FileName + Extension);
                if (File.Exists(FilePath))
                {
                    FileName = FileName + "_" + Guid.NewGuid();
                    FilePath = context.MapPath(FolderPath + FileName + Extension);
                }
                FileUploaded.SaveAs(FilePath);
                return FileName + Extension;
            }
            return "";
        }
    }
}
