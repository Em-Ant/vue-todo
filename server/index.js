const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./routes');
const db = require('./mware/db');

app.use('/dist', express.static(path.join(process.cwd(), '/dist')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', db, routes);

app.get('/', (req, res) =>
  res.sendFile(path.join(process.cwd(), './index.html'))
);

const port = process.env.PORT || 3000;
app.listen(port, () => `server listening on port ${port}`);
