# Installation of PERN JuniorPASS

1. Install PostgreSQL V16.1
2. Install Node.js V16.16.0
3. Install React V18.2.0
4. Install git
5. IDE: Visual Studio Code, Sublime

# Run your project

1. Clone this repository to your local computer by running this command on Terminal: `git clone https://github.com/yeeqinghew/juniorPASS.git`
2. Run this command to set up DB locally:
   ```
   psql -U [DB username]
   \i [file where u cloned your project/juniorPASS/server/database.sql]
   ```
3. Once the repository got cloned into your computer, run these commands to run your FrontEnd on localhost:
   ```
   cd client
   npm start
   ```
4. Open another terminal to run your BackEnd on localhost:
   ```
   cd server
   nodemon
   ```
5. App is up running on http://localhost:3000
