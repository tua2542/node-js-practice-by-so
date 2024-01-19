const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'messages',
  password: 'SOtua-2542',
  port: 5432, // Adjust the port based on your PostgreSQL configuration
});

const createPostsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      imageUrl VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      creator VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log('Posts table created successfully');
    client.release();
  } catch (error) {
    console.error('Error creating posts table:', error);
  } finally {
    pool.end();
  }
};

module.exports = { createPostsTable };
