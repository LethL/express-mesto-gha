const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/router');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62e2530b487b39cee3aa34ab',
  };

  next();
});

app.use(router);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`Server listen on ${PORT}`);
});
