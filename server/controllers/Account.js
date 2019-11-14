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
    return res.json({ redirect: '/maker' });
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
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  // makes sure the passwords match
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match' });
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
      return res.json({ redirect: '/maker' });
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
    return res.render('account', { csrfToken: req.csrfToken(), userInfo: docs });
  });
  // res.render('account', { csrfToken: req.csrfToken() });
};

/* const changePassword = (request, response) => {
  const req = request;
  const res = response;

  Account.findById(req.ression.account._id, (err, doc) => {
    if (err) {
      return res.json(err);
    }
    if (!doc) {
      return res.json({ error: 'No Document found' });
    }
  });

  // Account.findById(req.session.account._id, (err, doc) => {
  //   if (err) { res.json(err); }
  //   if (!doc) {
  //     res.json({ error: 'No document found' });

  //     const account = doc;
  //     savePromise.then(() => {
  //       // send back response
  //     });
  //     savePromise.catch((err) => res.json(err));
  //   }
  // });
}; */

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;
module.exports.accountPage = accountPage;
// module.exports.changePassword = changePassword;
