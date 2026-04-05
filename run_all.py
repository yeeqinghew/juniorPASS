import subprocess
import os

def launch_project():
    print("🚀 Starting the project (Redis + FE + BE)...")

    # 1. Start Redis in WSL
    subprocess.run(["wsl", "-d", "Ubuntu", "-u", "root", "service", "redis-server", "start"])
    
    # 2. Paths
    base_path = r"C:\Users\Admin\Desktop\JP\juniorPASS"
    server_path = os.path.join(base_path, "server")
    client_path = os.path.join(base_path, "client")

    # 3. Open tabs in Windows Terminal
    cmd = (
        f'wt.exe nt -p "Ubuntu" --title "Redis" ; '
        f'nt -d "{server_path}" --title "Backend" cmd /k "nodemon" ; '
        f'nt -d "{client_path}" --title "Frontend" cmd /k "npm run dev"'
    )

    # Run via shell=True so Windows Terminal handles the semicolons correctly
    subprocess.run(cmd, shell=True)

    print("\n✅ All tabs opened in Windows Terminal!")

if __name__ == "__main__":
    launch_project()