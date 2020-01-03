const express = require('express');
const accountRouter = express.Router();
const logger = require('../logger');
const bodyParser = express.json();
const AccountService = require('../Services/AccountService');
const path = require('path');
const jwt = require('jsonwebtoken');
const AuthService = require('../Auth/AuthService');
const config = require('../config');

const checkToken = (req, res, next) => {
  const header = req.headers['authorization'];

  if (typeof header !== 'undefined') {
    const bearer = header.split(' ');
    const token = bearer[1];

    req.token = token;
    next();
  } else {
    res.sendStatus(403);
  }
};

accountRouter
  .route('/')
  .post(bodyParser, (req, res, next) => {
    const { name, email, location, password, username, avatar } = req.body;
    for (const field of [
      'name',
      'email',
      'location',
      'username',
      'password',
      'avatar'
    ])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    const passwordError = AccountService.validatePassword(password);

    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }
    AccountService.hasUserWithUserName(req.app.get('db'), username)
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: 'Username already taken' });

        return AccountService.hashPassword(password).then(hashedPassword => {
          const newAccount = {
            name,
            email,
            location,
            username,
            password: hashedPassword,
            date_created: 'now()',
            avatar
          };

          return AccountService.insertUser(req.app.get('db'), newAccount).then(
            user => {
              res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(AccountService.serializeUser(user));
            }
          );
        });
      })
      .catch(next);
  })
  .get(checkToken, (req, res, next) => {
    jwt.verify(req.token, config.JWT_SECRET, (err, authorizedData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        AuthService.getUserWithUserName(
          req.app.get('db'),
          authorizedData.sub
        ).then(dbUser => {
          delete dbUser.password;
          res.json({ dbUser });
        });
      }
    });
  });

accountRouter.route('/:username').delete((req, res, next) => {
  const { username } = req.params;
  const knexInstance = req.app.get('db');

  AccountService.deleteUser(knexInstance, username)
    .then(AccountService.deleteListingsOfDeletedUser(knexInstance, username))
    .then(res.status(204).end())
    .catch(next);
});

accountRouter.route('/public/:username').get(bodyParser, (req, res, next) => {
  const { username } = req.params;
  AuthService.getUserWithUserName(req.app.get('db'), username).then(dbUser => {
    delete dbUser.password;
    res.json({
      dbUser
    });
  });
});

module.exports = accountRouter;
