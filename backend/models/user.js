const db = require('../util/db');

const createUserTable = async () => {
    const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(255) DEFAULT 'I am new!'
  );
`;

    try {
        const client = await db.connect();
        await client.query(createTableQuery);
        console.log('Users table created successfully');
        client.release();
    } catch (error) {
        console.error('Error creating users table:', error);
    }

};

class User {
    static async create(email, hashedPassword, name) {
      const result = await db.query(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
        [email, hashedPassword, name]
      );
  
      return result.rows[0];
    }
  
    static async findByEmail(email) {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  
      return result.rows[0];
    }
  }




module.exports = { createUserTable, User };