// import mysql from 'mysql2';
import { Knex, knex } from 'knex'



const config: Knex.Config = {
  client: 'mysql2',
  connection: {
    host     : 'localhost',
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : 'instantpsycho',
  }
};

const knexInstance = knex(config);
// const connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : process.env.DB_USER,
//   password : process.env.DB_PASSWORD,
//   database : 'instantpsycho',
// });



export const db = knexInstance;

