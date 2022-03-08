### Docker 

* sudo service docker start

* sudo docker run --rm --name bot-biscoint --volume "/home/app/bot-biscoint:/srv/app" --workdir "/srv/app" --publish 3077:3077 -it node:14 bash

* docker exec -it bot-biscoint bash

* docker-compose up -d

* docker stop bot-biscoint

* docker rm bot-biscoint