const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user');

class UserController {
  static async signup(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }

      const email = req.body.email;
      const name = req.body.name;
      const password = req.body.password;

      const hashedPw = await bcrypt.hash(password, 12);
      const user = await User.User.create(email, hashedPw, name);

      res.status(201).json({ message: 'User created!', userId: user.id });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const user = await User.User.findByEmail(email);

      if (!user) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
      }

      const isEqual = await bcrypt.compare(password, user.password);

      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign(
        {
          email: user.email,
          userId: user.id.toString(),
        },
        'somesupersecretsecret',
        { expiresIn: '1h' }
      );

      res.status(200).json({ token: token, userId: user.id.toString() });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
}

module.exports = UserController;