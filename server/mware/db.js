const Datastore = require('nedb');
const db = new Datastore({ filename: './db', autoload: true });

module.exports = (req, res, next) => {
  req.db = db;
  next();
};
