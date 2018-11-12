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
Every time you need to sync the data, you can delete the old database, e.g. - stop mongod, do `rm -rf ~/mongodb/*`, then start mogod and sync with remote 'live' db.<br />
In case you get an error like mongorestore command not found:
- execute `ssh -i <your private key, must be registered on 45.55.254.21> <your user name>@45.55.254.21 --out <folder_to_store_dump>` on server to get mongo db dump files.
- then use `mongorestore <folder_with_mongo_dump>` on local machine to restore data.
    
4) Setup server
- open either cmd (on Windows) or terminal (on macOS/Linux) window
- `cd` into the `server` folder
- use either `npm install` or `yarn` to install packages
- run server api using `yarn start` or `yarn dev`

Note: For yarn to install packages properly you need Python2, Visual Studio Build Tools installed and PATH variable set.

5) Do the same on the `client` folder to start React application

6) You can check the `live-code-server` for main.js and index.js files if they are missing in your repo

## How to set up ssh with key access

### User setup

Note that these instructinons are for macOS/Linux users. There is a separate process for Windows, which I might describe later if needed.

1) Open terminal and choose a directory where you will keep your private keys for the remote access.

2) Run the following command:

`ssh-keygen -t rsa -b 4096 -C "your_email@example.com" -f donnieslist`

It will ask you for a password then create two files:

- "donnieslist", a private key, that you shoudl keep secure
- "donnieslist.pub", a public key

You may choose to use a passphrase or just leave it without a password. Note however that in later case everyone who has access to the key will be able to login to the server.

3) Send you public key, "donnieslist.pub" to Donny or a system administrator who will add the key to a list of trusted keys

4) When the key is updated on the server you can login using the following command:

`ssh -i <path to donnieslist generate above> <username>@45.55.254.21`

In place of `username` you will need to use the name that will be created for you another user


### Server setup

1) Create a new user or select a user which already exists, e.g. - 'ubuntu'

`sudo adduser <username>`

You will be asked to provide a password. Even though he will be able to login with a key, he still need a password to do certain tasks, like perform `sudo` commands.

Then there will be a bunch of other self-explanatory questions.

2) Then pretend you are a new user:

`sudo su <username>`

3) Now you will act as a new user and can add his keys.

- go to his home directory:

`cd`

- make sure .ssh folder exists:

`mkdir .ssh`

you may get an error message saying that the directory already exists

- open or create the file:

`vi .ssh/authorized_keys`

- if the file contains no data then paste the content of the user public key, which you should have received

- if you are adding keys to an existing account add the key as a new line in the end

- save the file

4) Make sure nobody except the current user has acceess to the key:

`chmod 700 .ssh`

`chmod 600 .ssh/authorized_keys`

5) Type `exit` to return back to your account. That's it. Now the user should be able to login with his private key as described above.



### Running using docker:

#### Before you start do the following:

1) Make sure 80 port is unused, kill nginx and apache servers on your local box.

2) Kill mongo service.

3) Add `https://www.donnieslist.com/` in `/etc/hosts`.(Be sure to comment this line to access production instance).

#### Running your dev server:
1) Install docker community edition.

2) Enter server folder run `docker build -t server -f Dockerfile.dev  .`

3) Enter client folder run `docker build -t client -f Dockerfile.dev .`

4) Enter balancer folder run `docker build -t balancer -f Dockerfile.dev .`

5) Run following command from root app folder.
`docker build -t db https://github.com/docker-library/mongo.git#:4.1`

6) Run `docker swarm init`
7) Run `docker stack deploy -c docker-compose.yml donnies-list` to start your server.