/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const models = require('../models');

const { Account } = models;

const AccountData = models.Account;

// Renders login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const errorPage = (req, res) => {
  res.render('error', { csrfToken: req.csrfToken() });
};

// Renders signup page
const signupPage = (req, res) => {
  res.render('signup', { csrfToken: req.csrfToken() });
};

// runs logout function
const logout = (req, res) => {
  // removes a user's session
  req.session.destroy();
  res.redirect('/');
};

// runs login
const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  // checks if both fields have values
  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // checks that username and password are correct
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    // if so, changes to maker page
    return res.redirect('/maker');
  });
};

// runs signup functionality
const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // checks that all fields are filled out
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // makes sure the passwords match
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // creates account
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.redirect('/maker');
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

// Renders Account page
const accountPage = (req, res) => {
  AccountData.AccountModel.findByUsername(req.session.account.username, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('account', {
      csrfToken: req.csrfToken(),
      userInfo: req.session.account,
    });
  });
  // res.render('account', { csrfToken: req.csrfToken() });
};

const changePassword = (request, response) => {
  const req = request;
  const res = response;

  // creates account
  Account.AccountModel.authenticate(
    req.session.account.username,
    req.body.oldPassword,
    // eslint-disable-next-line consistent-return
    (err, doc) => {
      if (err) {
        return res.status(400).json({ err });
      }

      if (!doc) {
        return res.status(400).json({ err: 'invalid credentials' });
      }

      Account.AccountModel.generateHash(req.body.newPass1, (salt, hash) => {
        Account.AccountModel.updateOne({ username: req.session.account.username },
          { salt, password: hash }, (error) => {
            if (err) {
              return res.status(400).json({ error });
            }

            return res.json({ message: 'password changed' });
          });
      });
    },
  );
};

module.exports.errorPage = errorPage;
module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;
module.exports.accountPage = accountPage;
module.exports.changePassword = changePassword;
