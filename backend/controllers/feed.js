const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');
const postModel = require('../models/post');

exports.getPosts = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;
    const perPage = 2;

    const { posts, totalItems } = await postModel.getPosts(currentPage, perPage);

    res.status(200).json({ 
      message: 'Fetched posts successfully.', 
      posts: posts,
    totalItems: totalItems
  });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file){
    const error = new Error('No image provided');
    error.statusCode = 422;
    throw error;
  }
  const { title, content } = req.body;
  const imageUrl = req.file.path.replace("\\","/");
  const creator = 'Maximilian';

  try {
    const createdPost = await postModel.createPost(title, content, imageUrl, creator);
    res.status(201).json({
      message: 'Post created successfully!',
      post: createdPost
    });
  } catch (error) {
    if (!error.statusCode) {
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
};exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;

    if (req.file) {
      imageUrl = req.file.path.replace("\\", "/");
    }

    if (!imageUrl) {
      const error = new Error('No file picked.');
      error.statusCode = 422;
      throw error;
    }

    const post = await postModel.getPostById(postId);

    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }

    if (imageUrl !== post.imageUrl) {
      // Assuming you have a function clearImage that removes the old image
      clearImage(post.imageUrl);
    }

    // Fix: Call updatePost instead of getPosts
    const updatedPost = await postModel.updatePost(postId, title, imageUrl, content);

    res.status(200).json({ message: 'Post updated!', post: updatedPost });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    // Get the post to check if it exists and to retrieve the image path
    const post = await postModel.getPostById(postId);

    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }

    // Assuming you have a function clearImage that removes the image
    clearImage(post.imageUrl);

    // Call the deletePost method from the postModel to delete the post from the database
    await postModel.deletePost(postId);

    res.status(200).json({ message: 'deleted post.' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};