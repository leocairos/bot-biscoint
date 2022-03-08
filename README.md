# BOT-BISCOINT

Bot to monitor available coins in the Biscoint API.
Monitor and send alerts via telegram.

## To execute

* Clone this repository
* Create your .env and fill in your information

* Run byterminal
```shell
npm install
npm start
```

### With Docker 

* sudo service docker start

* sudo docker run --rm --name bot-biscoint --volume "/home/app/bot-biscoint:/srv/app" --workdir "/srv/app" --publish 3077:3077 -it node:14 bash

* docker exec -it bot-biscoint bash

* docker-compose up -d
* docker stop bot-biscoint
* docker rm bot-biscoint