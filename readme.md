## Instant Physio pet project client

Idea for this project is to create a platform, which allows users to train from home with chosen personal coach.
If we have technology where we can use AI to create such personal coaches, this platform could be used.
That being said this is just a pet project to try out some technologies and patterns.

At current stage user can browse through coaches with use of filters. He can get more credits (for free, payments aren't implemented) and use those credits to book a meeting with chosen coach at chosen time. He can browse though his sessions and cancel them.

On client side sing up and coach/admin version of app was not implemented. On backend side api allows to create account and to manage them by admin. All coaches has been seeded using AI generated images with stable diffusion.

[DEMO link](https://instant-physio-frontend.vercel.app/)

[DEMO video](https://github.com/kamosz08/instant-physio-frontend/assets/38498544/5ba383a3-f735-4f03-b84a-2179df2435e2)


Potential for future:
- Sing up and coach/admin version of app on client side
- Handle training sessions -> chat and video calls between coach and client
- Payments

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

There are e2e api tests and complementary unit tests. E2E api tests mock as little as possible, they run on real database that is fresh created, migrated and seeded. This is to test entire app flow. They also run on CI.

To run e2e api tests locally:
1. Setup local mysql database so that user with values from .env.test can connect
2. `npm run test:api`

To run unit tests locally:
1. `npm run test:unit`

## Tech stack

Database:
- MySQL
- Redis

![instantphysio](https://github.com/kamosz08/instant-physio-frontend/assets/38498544/adbd1e42-6acd-4723-a5b9-1aa6b6812329)

https://dbdiagram.io/d/instantphysio-63ff3088296d97641d849986

Backend:
- Typescript
- Express
- Knex
- Jest, supertest

Frontend
- Typescript
- Next.js
- Tailwind with DaisyUI


## Deployment

Deploy in EC2:
1. Make sure you can SSH into EC2 instance
2. Copy code to EC2 instance: 
`rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' -e "ssh -i PATH_KEY.pem" . USER@IP_INSTANCE:~/app`
3. Setup .env file
4. Run docker compose with prod config: `sudo docker compose -f docker-compose.prod.yml up -d --build`

Deploy in EC2 (without docker):
1. Make sure you can SSH into EC2 instance
2. Copy code to EC2 instance: 
`rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' -e "ssh -i PATH_KEY.pem" . USER@IP_INSTANCE:~/app`
3. Setup .env file
4. Install packages: node, mysql, redis
5. Configure and start mysql and redis
6. Build and start app with `npm run build` and `npm run start` (or use `pm2` to start it in background)

## Conclusions
- Overall architecture of this project was obviously overkill. The easiest way to deliver such result would be to just use some managed DB and write API in Next.js

- Client: Using DIP from "Clean Architecture" and creating domain-logic seems like a scalable good solution. For this project it was a bit overkill, but now if we wanted to create for example mobile app we can export both domain-logic and backendApi as separate packages. Domain logic is the highest level and other packages (backendApi, frontend, mobile) would depend on it. Frontend and mobile packages would also depend on backendAPI.

- Backend: Feature based folder structure like one used in NestJS would make better developer experience than the one I have used here. At very small scale it becomes unoptimal to jump between folders. When we add new route we care about things related to this route so it makes sense to colocate them.

- Backend: Using knex instead of full ORM makes it easy to step down to pure SQL queries and still it can provide us some typesafety

- Backend: SQL vs NoSQL - this project didn't have any vision, sql database is not very flexible so it took some migrations. That being said I still think this use case fits SQL

- Correct approach for JWT tokens storage is to store acces_token in memory and refresh_token in safe cookie. This way we are protected from XSS and CSRF. [Best way to store JWT tokens](https://dev.to/cotter/localstorage-vs-cookies-all-you-need-to-know-about-storing-jwt-tokens-securely-in-the-front-end-15id)




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

## Instant Physio pet project client

Same for both: Here will be app description same of client and BE, demo link, GIF? POtential future

## How to run

Instructions for client/BE

## Tech stack
Same for both: Here list of used technologies, link/screen to database schema

## Deployment
Instructions for client/BE

## Conclusions
Same for both