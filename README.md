# Edit_X

Its an all functionalble code editor featuring 40 different programming languages.Integrated with live server and nextauth system.The frontend includes login using github/google oauth.Frontend includes editor panes
and output and input panes.use the run button to process the code writen in the file.

## Installation

clone the repository
```bash
git clone https://github.com/helium9/Hackistica-26.git
```

go to the Edit_X directory and run npm install

```bash
npm install
```

go to the server directory and run npm install

```bash
npm install
```

## Usage
To run the server 
go to Edit_X directory and run following--
```bash
npm run dev
```
To use the Application Create a .env.local file in the root directory of the Application and Use token 
```
NEXTAUTH_SECRET
GITHUB_SECRET
GITHUB_ID
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
MONGO_DB_URI
```

For setting the docker application

first install [docker](https://choosealicense.com/licenses/mit/) and [doker compose](https://docs.docker.com/compose)
in the server directory
```
cd judge0-v1.13.0
docker-compose up -d db redis
```

wait for 20 seconds then run

```
docker-compose up -d
```
wait for 1 minute and run

```docker ps ```

or look for the port in docker desktop

then go to localhost:{port}/about or localhost:{post}/dummy-client.html



##Future prospect

We will implement the extensions and the git version control in future updates.
git version is nearly implemented.



## License

[MIT](https://choosealicense.com/licenses/mit/)
