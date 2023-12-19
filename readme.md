## How to run

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

## Tests

There are e2e api tests and complementary unit tests. E2E api tests don't use mocking/mock as little as possible, they run on actual database to test entire app flow. They also run on CI.

To run e2e api tests locally:
1. Setup local mysql database so that user with values from .env.test can connect
2. `npm run test:api`

To run unit tests locally:
1. `npm run test:unit`

## App description

Main concept is to provide personal physical training to users. There are three types of users:
- user (basic)
- specialist
- admin

Existing features that this api provides:
- User can log in/register as specialist or normal user (patient) (authentication and authorization)
- Specialist accounts need to be approved by admin
- Anyone can browse through specialists, read their descriptions
- User can book a meeting with specialist

