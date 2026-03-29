import subprocess
import os

def launch_project():
    # 1. Start Redis in WSL (Current Window)
    # This triggers the WSL command from Windows
    print("🚀 Starting Redis in WSL...")
    subprocess.run(["wsl", "-d", "Ubuntu", "-u", "root", "service", "redis-server", "start"])

    # 2. Define Windows Absolute Paths
    # Using 'r' for raw strings to handle backslashes correctly
    base_path = r"C:\Users\Admin\Desktop\JP\juniorPASS"
    server_path = os.path.join(base_path, "server")
    client_path = os.path.join(base_path, "client")

    # 3. Open Backend in a NEW WINDOWS TAB (PowerShell)
    print("📂 Opening Backend (Windows)...")
    # -d sets the directory, then we run nodemon in powershell
    backend_cmd = f'wt.exe -w 0 nt -d "{server_path}" powershell -noExit -Command "nodemon"'
    subprocess.run(backend_cmd, shell=True)

    # 4. Open Frontend in a NEW WINDOWS TAB (PowerShell)
    print("📂 Opening Frontend (Windows)...")
    frontend_cmd = f'wt.exe -w 0 nt -d "{client_path}" powershell -noExit -Command "npm start"'
    subprocess.run(frontend_cmd, shell=True)

    print("\n✅ All tabs opened in Windows Terminal!")

if __name__ == "__main__":
    launch_project()