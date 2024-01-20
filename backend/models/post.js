// models/post.js
const pool = require('../controllers/db'); // Adjust the path accordingly


const createPostsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS posts (
      "id" SERIAL PRIMARY KEY,
      "title" VARCHAR(255) NOT NULL,
      "imageUrl" VARCHAR(255) NOT NULL,
      "content" TEXT NOT NULL,
      "creator" VARCHAR(255) NOT NULL,
      "createAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      "updateAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log('Posts table created successfully');
    client.release();
  } catch (error) {
    console.error('Error creating posts table:', error);
  }
};

const createPost = async (title, content, imageUrl) => {
    try {
      const client = await pool.connect();
  
      const insertPostQuery = `
        INSERT INTO posts ("title", "content", "imageUrl", "creator")
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
  
      const values = [title, content, `${imageUrl}`, 'Sakdipat']; // Adjust imageUrl and creator as needed
  
      const result = await client.query(insertPostQuery, values);
  
      client.release();
  
      return result.rows[0];
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };
  

  const getPostById = async (postId) => {
    try {
      const client = await pool.connect();
  
      const getPostQuery = 'SELECT * FROM posts WHERE id = $1';
      const result = await client.query(getPostQuery, [postId]);
  
      client.release();
  
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  };


  const getPosts = async () => {
    try {
      const client = await pool.connect();
  
      const getPostsQuery = 'SELECT * FROM posts';
      const result = await client.query(getPostsQuery);
  
      client.release();
  
      return result.rows;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  };

module.exports = { createPostsTable, createPost, getPostById, getPosts };
