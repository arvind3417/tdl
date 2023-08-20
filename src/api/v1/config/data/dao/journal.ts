import  db  from '../db';

async function allJournals() {
    return db('journals').limit(5);

}
async function getteacherJournals(id) {
  const results = await db('journals').where("teacher_id",id).select("*");
  console.log(results);
  
  return results[0]
}
async function getJournals(id) {
    const results = await db('journals').where({ id });
    return results[0]
  }

  async function removeJournals(id) {
    const results = await db('journals').where({ id }).del()
      .returning('*')
    return results[0]
  }


  async function createJournal(data) {
    console.log(data);
    
    const results =  db('journals')
      .insert(data)
      .returning('*')
      console.log(results);
      
    return results
  }
  async function updateeJournal(journalId, updateData) {
    const results = await db('journals')
      .where('id', journalId) // Assuming journalId is the ID of the journal you want to update
      .update(updateData)
      .returning('*');
        
    return results;
  }
  
  async function getStudentJournalsByUsername(username) {
    try {
      const studentJournals = await db('journals')
        .whereRaw('? = ANY (tagged_students)', [username])
        .select('*');

        console.log(studentJournals);
        
        
      return studentJournals;
    } catch (error) {
      throw error;
    }
  }


// async function createUser(username: string, email: string, password: string, role: string) {
//     console.log('====================================');
//     console.log("hiiiiye");
//     console.log('====================================');
//   const hashedPassword =  hashPassword(password);
//   const res =  db('users')
//     .insert({
//       username,
//       email,
//       password: hashedPassword,
//       role,
//     })
//     .returning('*');
//     return res;
// }

// async function getusersbyID(id: number) {
//   const results = await db('users').where({ id });
//   return results[0];
// }


export {
    allJournals,getJournals,removeJournals,createJournal,updateeJournal,getStudentJournalsByUsername,getteacherJournals


};
