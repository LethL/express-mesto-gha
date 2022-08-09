const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/router');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { userValidation, loginValidation } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', loginValidation, login);
app.post('/signup', userValidation, createUser);

app.use(auth);

app.use(router);

app.use(errors());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`Server listen on ${PORT}`);
});
