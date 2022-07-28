const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/user');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use(routes);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`Server listen on ${PORT}`);
});
