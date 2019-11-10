/* eslint-disable linebreak-style */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/no-self-import */
module.exports.Account = require('./Account.js');
module.exports.Domo = require('./Domo.js');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};

// mongoose.Types.ObjectID converts string ID to Mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
const setIngredients = (listOfFood) => _.escape(listOfFood).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  age: {
    type: String,
    required: true,
    trim: true,
    set: setIngredients,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return DomoModel.find(search).select('name age').exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
