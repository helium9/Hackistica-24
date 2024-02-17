# Edit_X

Its an all functionalble code editor featuring 40 different programming languages.Integrated with live server and nextauth system.The frontend includes login using github/google oauth.Frontend includes editor panes
and output and input panes.use the run button to process the code writen in the file.

## Installation

clone the repository
```bash
git clone <repo_link>
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

For setting the docker application
first install [docker](https://choosealicense.com/licenses/mit/) and [doker compose](https://docs.docker.com/compose)
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



##Future prospect

We will implement the extensions and the git version control in future updates.
git version is nearly implemented.



## License

[MIT](https://choosealicense.com/licenses/mit/)
