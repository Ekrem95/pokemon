const express = require('express');
const path = require('path');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('cors');

const app = express();

app.use(compression());
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'src/public')));

app.use('/', require('./router'));

const port = process.env.PORT || 3000;

if (!module.parent) {
  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
}

module.exports = app;
