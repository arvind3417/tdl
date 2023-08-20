import  db  from '../db';
// const Knex = require("../db")
import { hashPassword } from '../../../helpers/hashedPassword';

async function getUserByEmail(email: string):  Promise<any | null> {
  const res = db
    .select('*')
    .from('users')
    .where('email', email)
    .first();

    return res;
}

async function createUser(username: string, email: string, password: string, role: string) {
    console.log('====================================');
    console.log("hiiiiye");
    console.log('====================================');
  const hashedPassword =  hashPassword(password);
  const res =  db('users')
    .insert({
      username,
      email,
      password: hashedPassword,
      role,
    })
    .returning('*');
    return res;
}

async function getusersbyID(id: number) {
  const results = await db('users').where({ id });
  return results[0];
}


export {
  getUserByEmail,
  createUser,
  getusersbyID,
  // Other exported methods...
};
