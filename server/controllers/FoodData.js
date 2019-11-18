/* eslint-disable linebreak-style */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
const models = require('../models');

const Data = models.Data;

/* Renders app page */
const makerPage = (req, res) => {
  Data.DataModel.findByMeal(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), foodData: docs });
  });
};

/* Renders data page */
const dataPage = (req, res) => {
  Data.DataModel.findByMeal(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('display', {
      csrfToken: req.csrfToken(),
      displayFood: docs,
    });
  });
};

/* Adding meal to database functionality */
const makePost = (req, res) => {
  if (!req.body.name || !req.body.ingredients) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  console.log(req.body.level);

  const foodData = {
    name: req.body.name,
    ingredients: req.body.ingredients,
    level: req.body.level,
    date: req.body.date,
    owner: req.session.account._id,
  };

  const newMeal = new Data.DataModel(foodData);

  const dataPromise = newMeal.save();

  dataPromise.then(() => res.json({ redirect: 'maker' }));

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
module.exports.makePost = makePost;
