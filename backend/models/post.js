const db = require('../util/db');

const createPostsTable = async () => {
  const createTableQuery = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS posts (
      id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      "imageUrl" VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      creator VARCHAR(255) NOT NULL,
      "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    const client = await db.connect();
    await client.query(createTableQuery);
    console.log('Posts table created successfully');
    client.release();
  } catch (error) {
    console.error('Error creating posts table:', error);
  }
};

const createPost = async (title, content, imageUrl, creator) => {
  try {
    const client = await db.connect();

    const insertPostQuery = `
      INSERT INTO posts ("title", "content", "imageUrl", "creator")
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;



    const values = [title, content, imageUrl, creator];

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
    const client = await db.connect();

    const getPostQuery = 'SELECT * FROM posts WHERE id = $1';
    const result = await client.query(getPostQuery, [postId]);

    client.release();

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

const getPosts = async (currentPage, perPage) => {
  try {
    const client = await db.connect();

    const countQuery = 'SELECT COUNT(*) FROM posts';
    const countResult = await client.query(countQuery);
    const totalItems = countResult.rows[0].count;

    const getPostsQuery = 'SELECT * FROM posts OFFSET $1 LIMIT $2';
    const offset =(currentPage - 1) * perPage;
    const result = await client.query(getPostsQuery, [offset, perPage]);

    client.release();

    return {
      posts: result.rows,
      totalItems: totalItems,
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

const updatePost = async (id, title, imageUrl, content) => {
  try {
    const client = await db.connect();

    const updatedPostQuery = 'UPDATE posts SET "title" = $1, "imageUrl" = $2, "content" = $3 WHERE "id" = $4 RETURNING *';
    const result = await client.query(updatedPostQuery, [title, imageUrl, content, id]);

    client.release();

    return result.rows[0];
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

const deletePost = async (id) => {
  try{
    const client = await db.connect();

    const deletePostQuery = 'DELETE FROM posts WHERE "id" = $1 RETURNING *';
    const result = await client.query(deletePostQuery, [id]);

    client.release();

    return result.rows[0];
  } catch (error) {
    console.log('Error deleting post:', error);
    throw error;
  }
}

module.exports = { createPostsTable, createPost, getPostById, getPosts, updatePost, deletePost };