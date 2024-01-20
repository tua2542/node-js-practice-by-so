const { validationResult } = require('express-validator');
const postModel = require('../models/post');
const multer = require('multer');
const upload = multer({ dest: 'images/' });

exports.getPosts = async (req, res, next) => {
    try {
      const posts = await postModel.getPosts();
  
      res.status(200).json({ message: 'Fetched posts successfully.', posts: posts });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  };

exports.createPost =  async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;

  try {
    // Assuming createPost is a function that inserts a post into the database
    const createdPost = await postModel.createPost(title, content);

    res.status(201).json({
      message: 'Post created successfully!',
      post: createdPost
    });
  } catch (error) {
    if(!error.statusCode) {
        error.statusCode = 500;
    }
    next(error);
  }
};


exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await postModel.getPostById(postId);

    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: 'Post fetched.', post: post });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};