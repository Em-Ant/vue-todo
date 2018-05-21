const router = require('express').Router();
const { promisify } = require('util');

const delay = require('../mware/delay');
router.use(delay(500));

router.get('/todo/:id', (req, res, next) => {
  const { db } = req;
  db.find({ _id: req.params.id }).exec((err, [data]) => {
    if (err) return next(err);
    res.json(data);
  });
});
router.get('/todo', (req, res, next) => {
  const { db } = req;
  db
    .find({ $not: { dead: true } })
    .sort({ ts: 1 })
    .exec((err, data) => {
      if (err) return next(err);
      res.json(data);
    });
});
router.post('/todo', async (req, res, next) => {
  const { db } = req;
  const item = req.body;
  item.ts = Date.now();
  const insert = promisify(db.insert).bind(db);
  try {
    const data = await insert(item);
    res.json(data);
  } catch (e) {
    next(e);
  }
});
router.delete('/todo/:id', async (req, res, next) => {
  const { db } = req;
  const _id = req.params.id;
  const update = promisify(db.update).bind(db);
  try {
    const data = await update(
      { _id },
      { $set: { dead: true, td: Date.now() } }
    );
    res.json(data);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
