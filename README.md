# Donny's List
Project based on providing online coaching. Build on top of MERN platform using Javascript ES6 Features.

## Setting up
1) Clone the project
`git clone https://<your login on bitbucket>@bitbucket.org/donnydey/donnies-list.git`
2) Setup mongo db
*(this step is not needed since we will be using online database)*
- Import the monodb database files in 10-09-2018 or select the most updated folder
- Make sure that mongodb is running and configured properly in the server folder.
3) Connect remote mondodb to local port using `ssh` command in terminal:
`ssh -L 127.0.0.1:27017:localhost:27017 <username>@45.55.254.21`
*(you need to obtain user name and password from Donny)*
4) Setup server
- open either cmd (on Windows) or terminal (on macOS/Linux) window
- `cd` into the `server` folder
- use either `npm install` or `yarn` to install packages
- run server api using `yarn start` or `yarn dev`
5) Do the same on the `client` folder to start React application
8) You can check the `live-code-server` for main.js and index.js files if they are missing in your repo