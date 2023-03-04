import * as dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
// import router from './routes';
import { db } from './db'
import { initialize } from './middlewares/auth'
import { usersService } from './services/users'
import usersRouter from './routers/users'
import specializationsRouter from './routers/specializations'
import { logger } from './middlewares/logger'
import { errorHandler } from './middlewares/errorHandler'

const PORT = 3000

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(logger)
app.use(initialize())
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/specializations', specializationsRouter)
app.use(errorHandler)

app.listen(PORT, (): void => {
  console.log('Server Running!')
})

// db('user')
//   .first()
//   .then(
//     (res) => {
//       console.log(res)
//     },
//     (err) => {
//       console.log(err)
//     }
//   )

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
