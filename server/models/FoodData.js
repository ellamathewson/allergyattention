/* eslint-disable linebreak-style */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/no-self-import */
module.exports.Account = require('./Account.js');
module.exports.Data = require('./FoodData.js');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let DataModel = {};

// mongoose.Types.ObjectID converts string ID to Mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
const setIngredients = (listOfFood) => _.escape(listOfFood).trim();

const DataSchema = new mongoose.Schema({
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

  date: {
    type: Date,
    default: Date.now,
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

DataSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  date: doc.date,

});

DataSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return DataModel.find(search).select('name age date').exec(callback);
};

DataModel = mongoose.model('Domo', DataSchema);

module.exports.DataModel = DataModel;
module.exports.DataSchema = DataSchema;
