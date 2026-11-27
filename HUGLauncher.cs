using System;
using System.Diagnostics;
using System.IO;

namespace HugDesktopLauncher
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            try
            {
                string projectDir = @"D:\Desenvolvimento\Projetos\multiplex-ia";
                string electronExe = Path.Combine(projectDir, @"node_modules\electron\dist\electron.exe");
                string mainScript = Path.Combine(projectDir, @"electron\main.cjs");

                ProcessStartInfo psi = new ProcessStartInfo();
                psi.FileName = electronExe;
                psi.Arguments = "\"" + mainScript + "\"";
                psi.WorkingDirectory = projectDir;
                psi.UseShellExecute = false;
                psi.CreateNoWindow = true;
                psi.WindowStyle = ProcessWindowStyle.Normal;

                if (psi.EnvironmentVariables.ContainsKey("ELECTRON_RUN_AS_NODE"))
                {
                    psi.EnvironmentVariables.Remove("ELECTRON_RUN_AS_NODE");
                }
                Environment.SetEnvironmentVariable("ELECTRON_RUN_AS_NODE", null);

                Process.Start(psi);
            }
            catch
            {
                try
                {
                    ProcessStartInfo fallbackPsi = new ProcessStartInfo();
                    fallbackPsi.FileName = "wscript.exe";
                    fallbackPsi.Arguments = "\"D:\\Desenvolvimento\\Projetos\\multiplex-ia\\iniciar-hug.vbs\"";
                    fallbackPsi.WorkingDirectory = @"D:\Desenvolvimento\Projetos\multiplex-ia";
                    fallbackPsi.WindowStyle = ProcessWindowStyle.Hidden;
                    fallbackPsi.CreateNoWindow = true;
                    Process.Start(fallbackPsi);
                }
                catch { }
            }
        }
    }
}
