To start app and database run `docker-compose up`

To seed DB with some example data run:
1. `docker ps` to get node app container id
2. `docker exec -it CONTAINER_ID sh`
3. `npm run seed`

To work directly on mysql DB:
1. `docker ps` to get mysql container id
2. `docker exec -it CONTAINER_ID sh`
3. `mysql -u {USER} -p`
4. enter password for given user
4. run any mysql command (SELECT/DROP...)