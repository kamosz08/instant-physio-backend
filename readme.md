To start app and database run `docker-compose up`

To seed DB with some example data run:
1. `docker ps` to get container id
2. `docker exec -it CONTAINER_ID sh`
3. `npm run seed`