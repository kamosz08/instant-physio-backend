import * as dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
// import router from './routes';
import {db} from './db';
import { initialize } from './middlewares/auth';
import { usersService } from './services/users';
import usersRouter from './routers/users';

const PORT = 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use((req, res, next) => {
  const { method, path } = req;
  console.log(
    `New request to: ${method} ${path} at ${new Date().toISOString()}`
  );
  next();
});

app.use(initialize());

db("users").first().then(res=>{
  console.log(res);

}, err=>{
  console.log(err);
  
});

// usersService.create({email: 'test@test.test', name: "test", password: "test"}).then(res=>{
//   console.log(res);

// });

// connection.connect(function(err) {
//   if (err) throw err;
//   console.log('Database is connected successfully !');
// });
// connection.query('SELECT * from movie', function (error, results, fields) {
//   if (error) throw error;
//   // console.log('The solution is: ', results[0].solution);
//   console.log(results);
// });
 
// connection.end();

// app.use("/", router)
app.use("/api/v1/users", usersRouter);


app.listen(PORT, (): void => {
  console.log("Server Running!");
});