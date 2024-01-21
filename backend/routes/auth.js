const express = require('express');

const UserController = require('../controllers/auth');

const { body } = require('express-validator');


const router = express.Router();

router.put(
  '/signup',
  [
    body('email').isEmail().withMessage('Please enter a valid email.'),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty(),
  ],
  UserController.signup
);

module.exports = router;