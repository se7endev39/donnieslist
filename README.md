# Donny's List
Project based on providing online coaching. Build on top of MERN platform using Javascript ES6 Features.

## Branch `oct1-merged` has most recented changes merged in from master branch as well as the other branches. It is possible that I missed something while diffing and merging, so please bring up any issues. --As of Oct 8,2018.

## Setting up
1) Clone the project
`git clone https://<your login on bitbucket>@bitbucket.org/donnydey/donnies-list.git`
2) Setup mongo db.
- install the database
- create a database folder, e.g. `~/mongodb`
- run the databse from terminal `mongod --dbpath ~/mongodb`
3) Clone mongo database from 'live' server using the following script (macOS or Linux):
```
#!/bin/sh

# This command will create mongodb dump archive on the remote computer, send it back to local machine and install on local mondodb.
ssh -i <your private key, must be registered on 45.55.254.21> <your user name>@45.55.254.21 '( mongodump --archive )' | mongorestore --archive
```
Every time you need to sync the data, you can delete the old database, e.g. - stop mongod, do `rm -rf ~/mongodb/*`, then start mogod and sync with remote 'live' db.
4) Setup server
- open either cmd (on Windows) or terminal (on macOS/Linux) window
- `cd` into the `server` folder
- use either `npm install` or `yarn` to install packages
- run server api using `yarn start` or `yarn dev`
5) Do the same on the `client` folder to start React application
8) You can check the `live-code-server` for main.js and index.js files if they are missing in your repo
