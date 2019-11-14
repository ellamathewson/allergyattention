/* eslint-disable linebreak-style */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
const models = require('../models');

const Data = models.Data;

const makerPage = (req, res) => {
  Data.DataModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), foodData: docs });
  });
};

const dataPage = (req, res) => {
  Data.DataModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('display', { csrfToken: req.csrfToken(), foodData: docs });
  });
};

const makePost = (req, res) => {
  if (!req.body.name || !req.body.ingredients) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  console.log(req.body.level);

  const domoData = {
    name: req.body.name,
    ingredients: req.body.ingredients,
    level: req.body.level,
    date: req.body.date,
    owner: req.session.account._id,
  };

  const newDomo = new Data.DataModel(domoData);

  const dataPromise = newDomo.save();

  dataPromise.then(() => res.redirect('/maker'));

  dataPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Food already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return dataPromise;
};

module.exports.makerPage = makerPage;
module.exports.dataPage = dataPage;
module.exports.make = makePost;
