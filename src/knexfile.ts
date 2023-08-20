// require('dotenv').config();
// module.exports = {
//   development: {
//     client: 'pg',
//     connection: {
//       database:"test1",
//       user:"postgres",
//       password:"1234"
//     },
//     searchPath: ['knex', 'public'],
//     migrations: {
//       directory: './api/v1/config/data/migrations',
//     },
//     seeds: { directory: './api/v1/config/data/migrations' },
//   },

//   testing: {
//     client: 'pg',
//     // connection: process.env.DB_URL,
//     connection: {
//       database:"test1",
//       user:"postgres",
//       password:"1234"
//     },
//     searchPath: ['knex', 'public'],
//     migrations: {
//       directory: './api/v1/config/data/migrations',
//     },
//     seeds: { directory: './api/v1/config/data/migrations' },
//   },

//   production: {
//     client: 'pg',
//     // connection: process.env.DB_URL,
//     connection: {
//       database:"test1",
//       user:"postgres",
//       password:"1234"
//     },
//     searchPath: ['knex', 'public'],
//     migrations: {
//       directory: './api/v1/config/data/migrations',
//     },
//     seeds: { directory: './api/v1/config/data/migrations' },
//   },
// };


import type { Knex } from "knex";
import dotenv from 'dotenv'; 
dotenv.config({path:'C:/Users/HP/Desktop/tdl/.env'});
// dotenv.config();

// import path from "path";

console.log(process.env.DB_URL);

// Update with your config settings.
interface IknexConfig{
  [key:string]:Knex.Config
}

 const configs: IknexConfig = {
  development: {
    client: 'pg',
    connection: process.env.DB_URL,
    pool: {
      min: 0,
      max: 7,
      acquireTimeoutMillis: 300000,
      createTimeoutMillis: 300000,
      destroyTimeoutMillis: 50000,
      idleTimeoutMillis: 300000,
      reapIntervalMillis: 10000,
      createRetryIntervalMillis: 2000,
      propagateCreateError: false,
    },
    acquireConnectionTimeout: 60000,
    
    // connection: {
    //   database:"test1",
    //   user:"postgres",
    //   password:"1234"
    // },
    searchPath: ['knex', 'public'],
    migrations: {
      directory:'./migrations',
    },
    seeds: { directory: './seeds' },
  },

  testing: {
    client: 'pg',
    connection: process.env.DB_URL,
    // connection: {
    //   database:"test1",
    //   user:"postgres",
    //   password:"1234"
    // },
    searchPath: ['knex', 'public'],
    migrations: {
      directory: './migrations',

      // directory: './migrations',
    },
    seeds: { directory: './seeds' },
  },

  production: {
    client: 'pg',
    connection: process.env.DB_URL,
    // connection: {
    //   database:"test1",
    //   user:"postgres",
    //   password:"1234"
    // },
    searchPath: ['knex', 'public'],
    migrations: {
      directory: './migrations',
    },
    seeds: { directory:'./seeds'},
  },

};
export default configs
// module.exports = config;
